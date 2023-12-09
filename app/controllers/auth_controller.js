const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user_model");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

exports.signup = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).send({ message: "Missing email id." });
  }
  try {
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
    res.cookie("jwt", token, { httpOnly: false, secure: false });
    return res.status(201).json({
      status: "success",
      data: {
        user: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  const Identity = req.body.identity;
  const password = req.body.password;
  try {
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
    res.cookie("jwt", token, { httpOnly: false, secure: false });
    return res.status(201).json({
      status: "success",
      data: {
        user: user.username,
        email: user.email,
        id: user._id,
        profileImage: user.profileImage,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.cookie) {
    token = req.headers.cookie.split("jwt=")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not loged in please login",
    });
  }

  //2)Verfication token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.USER_VERIFICATION_TOKEN_SECRET
  );

  //3)Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message: "No user exists",
    });
  }

  //4)Check if user changed password after jwt is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: "fail",
      message: "Password Changed after token issued",
    });
  }

  req.user = currentUser;
  next();
};

exports.forgotPassword = async (req, res) => {
  const identity = req.body.identity;

  // 1)Get user based on post email
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
  // 2)Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save();

  // 3)Send it to the user
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
};

exports.resetPassword = async (req, res, next) => {
  // 1)Get user based on user
  const password = req.body.password;
  const hashedToken = req.params.token;

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2)If token as not expired and user is there than set new password
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Token is invalid or expired",
      statusCode: 400,
    });
  }

  // 3)Update changed password porperty for user
  user.password = password;
  user.passwordResetToken = "";
  user.passwordResetExpires = 0;
  user.passwordChangedAt = Date.now();
  await user.save();

  // 4)Log the user and send jwt
  const token = jwt.sign(
    { id: user._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  req.user = user;
  res.cookie("jwt", token, { httpOnly: false, secure: false });

  return res.status(200).json({
    status: "success",
    message: "Password has Changed",
    statusCode: 200,
  });
};
