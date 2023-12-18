const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user_model");
const sendEmail = require("../utils/email");

exports.signup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(422).send({ message: "Missing email id." });
    }
    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return res.status(409).send({
        message: "Email is already in use.",
      });
    }
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
      dob: req.body.dob,
      country: req.body.country,
      profileImage: req.body.profileImage,
    });

    const message = `Dear ${user.username},\n$Welcome to AyurAid!`;
    await sendEmail({
      email: email,
      subject: "Welcome to AyurAid",
      message,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.cookie("jwt", token, {
      httpOnly: false,
      secure: false,
      sameSite: "none",
    });
    return res.status(201).json({
      status: "success",
      data: {
        user: user.username,
        token: token,
      },
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const Identity = req.body.identity;
    const password = req.body.password;
    if (!Identity || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }
    let user = await User.findOne({ email: Identity }).select("+password");

    if (!user) {
      user = await User.findOne({ username: Identity }).select("+password");
    }

    if (!user || !(await user.authenticate(password, user.password))) {
      res.cookie("jwt", undefined, { httpOnly: false, secure: false });
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    req.user = user;
    res.cookie("jwt", token, {
      httpOnly: false,
      secure: false,
      sameSite: "none",
    });
    return res.status(201).json({
      status: "success",
      data: {
        user: user.username,
        email: user.email,
        id: user._id,
        profileImage: user.profileImage,
        fullname: user.fullName,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.get("Token")) {
      token = req.get("Token");
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not loged in please login",
      });
    }

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "No user exists",
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "Password Changed after token issued",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const identity = req.body.identity;

    let user = await User.findOne({ username: identity });
    if (!user) {
      user = await User.findOne({ email: identity });
    }
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: `Email dosen't exists`,
        statusCode: 400,
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const message = `Forgot your password? Reset your password with token: http://localhost:3000/auth/forgot-password/${resetToken}, If not than ignore`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token is valid for 20mins",
        message,
      });
      return res.status(200).json({
        status: "success",
        message: "Token send to email",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({
        status: "fail",
        message: `There was error sending email try again later ${err}`,
      });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const hashedToken = req.params.token;

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Token is invalid or expired",
        statusCode: 400,
      });
    }

    user.password = password;
    user.passwordResetToken = "";
    user.passwordResetExpires = 0;
    user.passwordChangedAt = Date.now();
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    req.user = user;
    res.cookie("jwt", token, {
      httpOnly: false,
      secure: false,
      sameSite: "none",
    });

    return res.status(200).json({
      status: "success",
      data: {
        token,
      },
      message: "Password has Changed",
      statusCode: 200,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    let user = await User.findById(req.user.id).select("+password");

    if (!(await user.authenticate(currentPassword, user.password))) {
      return {
        status: "fail",
        message: "Password entered is incorrect",
        statusCode: 400,
      };
    }

    user.password = newPassword;
    await user.save();
    user = await User.findById(req.user.id);

    const token = jwt.sign(
      { id: user.id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
      message: "Password has Changed",
      statusCode: 200,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
