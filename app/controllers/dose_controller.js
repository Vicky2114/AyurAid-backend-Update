const Dosage = require("../models/dose_model");
const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.USER_VERIFICATION_TOKEN_SECRET;

const getUserIdFromRequest = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, accessTokenSecret);
  return decoded.id;
};
// Add Dosage
exports.addDosage = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const duration = req.body.duration;
    const frequency = req.body.frequency;
    const description = req.body.description;
    const timing = req.body.timing;

    if (timing.length !== frequency) {
      return res.status(400).json({ message: "Add timing for all frequency" });
    }

    const dosage = await Dosage.create({
      userId: userId,
      duration: duration,
      frequency: frequency,
      description: description,
      timing: timing,
    });

    if (!dosage) {
      return res.status(401).json({
        status: "fail",
        message: "Failed to add dosage",
        statusCode: 400,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Dosage added successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

// Fetch SingleDose
exports.getDosageById = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const dosageId = req.params.id;

    const dosage = await Dosage.findOne({ _id: dosageId, userId: userId });

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found or does not belong to the user",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      data: dosage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

// Fetch All Dosages
exports.getAllDosages = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const dosages = await Dosage.find({ userId: userId });
    return res.status(200).json({
      status: "success",
      data: dosages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

// Update
exports.updateDosage = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const dosageId = req.params.id;
    const updatedDosage = req.body;

    const dosage = await Dosage.findOneAndUpdate(
      { _id: dosageId, userId: userId },
      updatedDosage,
      { new: true }
    );

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found or does not belong to the user",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Dosage updated successfully",
      // data: dosage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

// Delete
exports.deleteDosage = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const dosageId = req.params.id;

    const dosage = await Dosage.findOneAndDelete({
      _id: dosageId,
      userId: userId,
    });

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found or does not belong to the user",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Dosage deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};
