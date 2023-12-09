const Dosage = require("../models/dose_model");

// Add Dosage
exports.addDosage = async (req, res) => {
  try {
    const duration = req.body.duration;
    const frequency = req.body.frequency;
    const description = req.body.description;
    const timing = req.body.timing;

    if (timing.length !== frequency) {
      return res.status(400).json({ message: "Add timing for all frequency" });
    }

    const dosage = await Dosage.create({
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
    const dosageId = req.params.id;
    const dosage = await Dosage.findById(dosageId);

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found",
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
    const dosages = await Dosage.find();
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
    const dosageId = req.params.id;
    const updatedDosage = req.body;

    const dosage = await Dosage.findByIdAndUpdate(dosageId, updatedDosage, {
      new: true,
    });

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Dosage updated successfully",
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

// Delete
exports.deleteDosage = async (req, res) => {
  try {
    const dosageId = req.params.id;
    const dosage = await Dosage.findByIdAndDelete(dosageId);

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Dosage deleted successfully",
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
