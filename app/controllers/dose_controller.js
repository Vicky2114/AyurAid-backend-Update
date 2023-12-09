const Dosage = require("../models/dose_model");

// Add Dosage
exports.addDosage = async (req, res) => {
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

  return res.status(200).json({
    status: "success",
    message: "Dosage added successfully",
    data: {
      dosage,
    },
    statusCode: 200,
  });
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
    const { duration, frequency, description, timing } = req.body;

    let dosage = await Dosage.findById(dosageId);

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found",
        statusCode: 404,
      });
    }

    const data = {
      duration: duration,
      frequency: frequency,
      description: description,
      timing: timing,
    };

    await Dosage.findByIdAndUpdate(dosageId, { $set: data });
    dosage = await Dosage.findById(dosageId);

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
