const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user_model");
const sendEmail = require("../utils/email");

exports.signup = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      fullName,
      dob,
      country,
      profileImage,
      isDiabetes,
      heart,
      lungs,
      liver,
      allergies,
      bmi,
      role,
      degree,
    } = req.body;

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
      username: username,
      email: email,
      password: password,
      fullName: fullName,
      dob: dob,
      country: country,
      profileImage: profileImage,
      isDiabetes: isDiabetes,
      heart: heart,
      lungs: lungs,
      liver: liver,
      allergies: allergies,
      bmi: bmi,
      role: role,
      degree: degree,
    });

    const message = `Dear ${user.username},\n$Welcome to AyurAid!\nTo verify your email id click on this link\n https://ayur-aid-web.vercel.app/verifyEmail/${user._id}`;
    await sendEmail({
      email: email,
      subject: "Welcome to AyurAid",
      message,
    });

    if (user.verifyEmail == false) {
      res.cookie("jwt", undefined, { httpOnly: false, secure: false });
      return res.status(401).json({
        status: "fail",
        message: "Please verify your email from mail",
      });
    }

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
        user: user,
        token: token,
      },
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.signupExpert = async (req, res) => {
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
      degree: req.body.degree,
      role: req.body.role,
    });

    const message = `Dear ${user.username},\n$Welcome to AyurAid!\nTo verify your email id click on this link\n https://ayur-aid-web.vercel.app/${user._id}`;
    await sendEmail({
      email: email,
      subject: "Welcome to AyurAid",
      message,
    });

    if (user.verifyEmail == false) {
      res.cookie("jwt", undefined, { httpOnly: false, secure: false });
      return res.status(401).json({
        status: "fail",
        message: "Please verify your email from mail",
      });
    }

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

    if (user.verifyEmail == false) {
      const message = `Dear ${user.username},\n$Welcome to AyurAid!\nTo verify your email id click on this link\n https://ayur-aid-web.vercel.app/verifyEmail/${user._id}`;
      await sendEmail({
        email: user.email,
        subject: "Verify your email with AyurAid",
        message,
      });
      res.cookie("jwt", undefined, { httpOnly: false, secure: false });
      return res.status(401).json({
        status: "fail",
        message: "Please verify your email from mail",
      });
    }

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
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.loginExpert = async (req, res) => {
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

    if (!user.isVerified || user.role != "expert") {
      res.cookie("jwt", undefined, { httpOnly: false, secure: false });
      return res.status(401).json({
        status: "fail",
        message: "You are not authorized",
      });
    }

    if (user.verifyEmail == false) {
      const message = `Dear ${user.username},\n$Welcome to AyurAid!\nTo verify your email id click on this link\n https://ayur-aid-web.vercel.app/verifyEmail/${user._id}`;
      await sendEmail({
        email: user.email,
        subject: "Verify your email with AyurAid",
        message,
      });
      res.cookie("jwt", undefined, { httpOnly: false, secure: false });
      return res.status(401).json({
        status: "fail",
        message: "Please verify your email from mail",
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

exports.emailVerification = async (req, res, next) => {
  try {
    const verifyEmailId = req.params.verifyEmailId;

    let user = await User.findById(verifyEmailId);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Email not found",
        statusCode: 400,
      });
    }
    user.verifyEmail = true;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "Email id verified",
      statusCode: 200,
    });
  } catch {
    return res.status(400).json({
      status: "fail",
      message: "Email id not verified",
      statusCode: 400,
    });
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
    console.log(user);
    const bol = await user.authenticate(currentPassword, user.password);
    if (!bol) {
      return res.status(400).send({
        status: "fail",
        message: "Password old entered is incorrect",
      });
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

// Expert Signup

exports.expertSignup = async (req, res) => {
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

    const expert = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
      dob: req.body.dob,
      country: req.body.country,
      profileImage: req.body.profileImage,
      role: "expert",
    });

    const message = `Dear ${expert.username},\nWelcome to AyurAid!`;
    await sendEmail({
      email: email,
      subject: "Welcome to AyurAid",
      message,
    });

    const token = jwt.sign(
      { id: expert._id },
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
        expert: expert.username,
        token: token,
      },
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Expert Login

exports.expertLogin = async (req, res) => {
  try {
    const Identity = req.body.identity;
    const password = req.body.password;

    if (!Identity || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    let expert = await User.findOne({ email: Identity, role: "expert" }).select(
      "+password"
    );

    if (!expert) {
      expert = await User.findOne({
        username: Identity,
        role: "expert",
      }).select("+password");
    }

    if (!expert || !(await expert.authenticate(password, expert.password))) {
      res.cookie("jwt", undefined, { httpOnly: false, secure: false });
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      { id: expert._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    req.expert = expert;

    res.cookie("jwt", token, {
      httpOnly: false,
      secure: false,
      sameSite: "none",
    });

    return res.status(201).json({
      status: "success",
      data: {
        expert: expert.username,
        email: expert.email,
        id: expert._id,
        profileImage: expert.profileImage,
        fullname: expert.fullName,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
