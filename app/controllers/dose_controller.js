const Dosage = require("../models/dose_model");
const translate = require("translate-google");

exports.addDosage = async (req, res) => {
  try {
    const userId = req.user._id;

    const duration = req.body.duration;
    const frequency = req.body.frequency;
    let description = req.body.description;
    const timing = req.body.timing;
    const slots = req.body.slots;
    let title = req.body.title;

    if (timing.length !== frequency) {
      return res.status(400).json({ message: "Add timing for all frequency" });
    }

    if (timing.length !== frequency) {
      return res.status(400).json({ message: "Add timing for all frequency" });
    }
    const dosage = await Dosage.create({
      userId: userId,
      duration: duration,
      frequency: frequency,
      description: description,
      timing: timing,
      slots: slots,
      title: title,
    });

    if (req.get("Lang")) {
      let lang = req.get("Lang");
      const titleData = await translate(title, { to: lang });
      const descriptionData = await translate(description, { to: lang });
      title = titleData;
      description = descriptionData;
    }

    return res.status(200).json({
      status: "success",
      message: "Dosage added successfully",
      data: {
        dosage,
      },
      statusCode: 200,
    });
  } catch (err) {
    return res.status(500).send(err);
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
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

exports.getDosageOfLogedIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const dosageId = req.params.id;

    const dosages = await Dosage.find({ userId: userId });

    if (!dosages) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found or does not belong to the user",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      data: dosages,
    });
  } catch (error) {
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
    const dosages = await Dosage.find({});
    return res.status(200).json({
      status: "success",
      data: dosages,
    });
  } catch (error) {
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

    const data = {
      duration: duration,
      frequency: frequency,
      description: description,
      timing: timing,
    };

    await Dosage.findByIdAndUpdate(dosageId, { $set: data });
    const dosage = await Dosage.findById(dosageId);

    return res.status(200).json({
      status: "success",
      message: "Dosage updated successfully",
      // data: dosage,
    });
  } catch (error) {
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
    const userId = req.user._id;
    const dosageId = req.params.id;

    const dosage = await Dosage.findOne({
      _id: dosageId,
    });

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage not found or does not belong to the user",
        statusCode: 404,
      });
    }

    if (userId != dosage.userId) {
      return res.status(401).json({
        status: "fail",
        message: "You are not authorized to delete this dose",
      });
    }

    Dosage.findByIdAndDelete(dosageId);

    return res.status(200).json({
      status: "success",
      message: "Dosage deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

// mark dosage slot

exports.markDosageSlot = async (req, res) => {
  try {
    const userId = req.user._id;
    const { dosageID, slotID, isCompleted } = req.body;

    const dosage = await Dosage.findOneAndUpdate(
      { userId: userId, _id: dosageID, "slots._id": slotID },
      { $set: { "slots.$.isCompleted": isCompleted } },
      { new: true }
    );

    if (!dosage) {
      return res.status(404).json({
        status: "fail",
        message: "Dosage or slot not found",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Dosage slot marked as completed successfully",
      data: dosage,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};
