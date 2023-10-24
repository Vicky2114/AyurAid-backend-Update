// exports.signup = async (req, res) => {
//   try {
//     const user = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: bcrypt.hashSync(req.body.password, 8),
//       fullName: req.body.fullName,
//       dob: req.body.dob,
//       country: req.body.country,
//     });

//     await user.save();
//     res.status(200).send({ message: "User was registered successfully!" });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

// exports.signin = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       username: req.body.username,
//     });

//     if (!user) {
//       return res.status(404).send({ message: "User Not found." });
//     }

//     const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

//     if (!passwordIsValid) {
//       return res.status(401).send({ message: "Invalid Password!" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       config.secret,
//       {
//         algorithm: 'HS256',
//         allowInsecureKeySizes: true,
//         expiresIn: 86400,
//       }
//     );

//     res.status(200).send({
//       id: user._id,
//       username: user.username,
//       email: user.email,
//       fullName: user.fullName,
//       dob: user.dob,
//       country: user.country,
//       token: token,
//     });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const bcrypt = require("bcrypt");
const User = db.user;

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
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

exports.signup = async (req, res) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      fullName: req.body.fullName,
      dob: req.body.dob,
      country: req.body.country,
    });

    await user.save();
    res.status(200).send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
