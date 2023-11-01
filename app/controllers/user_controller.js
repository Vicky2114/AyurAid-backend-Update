const env = require("dotenv").config({
  path: "C:/Users/91787/OneDrive/Desktop/AuthSystem/.env",
}).parsed;
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model.js");
const config = require("../config/auth.config.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});

const sendVerificationMail = (user) => {
  const verificationToken = user.generateVerificationToken();
  // console.log(verificationToken);
  const url = `http://localhost:3000/api/verify/${verificationToken}`;

  transporter.sendMail({
    to: user.email,
    subject: "Verify Account",
    html: `Click <a href = '${url}'>here</a> to confirm your email.`,
  });
};
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = await new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      fullName: req.body.fullName,
      dob: req.body.dob,
      country: req.body.country,
    }).save();

    sendVerificationMail(user);
    return res.status(201).send({
      message: `Sent a verification email to ${email}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};
exports.login = async (req, res) => {
  console.log("Loginnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
  try {
    const user = await User.findOne({ username: req.body.username }).exec();

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    if (!user.verified) {
      const email = user.email;

      if (!email) {
        return res.status(422).send({ message: user });
      }
      sendVerificationMail(user);
      return res.status(403).send({
        message: "Verify your Account.",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user._id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      dob: user.dob,
      country: user.country,
      token: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.verify = async (req, res) => {
  const token = req.params.id;

  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({
        message: "User does not exists",
      });
    }

    user.verified = true;
    await user.save();
    return res.status(200).send({
      message: "Account Verified",
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
