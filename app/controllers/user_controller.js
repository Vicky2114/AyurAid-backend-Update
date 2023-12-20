const User = require("../models/user_model");

exports.detailsOfLogenIn = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user._id);

    return res.status(201).json({
      status: "success",
      data: {
        user: userDetails,
      },
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.detailsById = async (req, res) => {
  try {
    const { id } = req.params;
    let userDetails = await User.findOne(
      { _id: id },
      { password: 0, token: 0 }
    );
    if (!userDetails) {
      userDetails = await User.findOne(
        { username: id },
        { password: 0, token: 0 }
      );
    }
    return res.status(201).json({
      status: "success",
      data: {
        userDetails,
      },
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, country, dob, profileImage, degree } = req.body;

    const data = {
      fullName: fullName,
      email: email,
      country: country,
      dob: dob,
      profileImage: profileImage,
      degree: degree,
    };

    await User.findByIdAndUpdate(req.user._id, { $set: data });
    const updatedUser = await User.findById(req.user._id);

    return res.status(201).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
