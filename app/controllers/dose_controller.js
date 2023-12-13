const jwt = require("jsonwebtoken");
const Dosage = require("../models/dose_model");
const accessTokenSecret = process.env.USER_VERIFICATION_TOKEN_SECRET;
const getUserIdFromRequest = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, accessTokenSecret);
  return decoded.id;
};

//Add Dosage

exports.addDosage = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const duration = req.body.duration;
    const frequency = req.body.frequency;
    const description = req.body.description;
    const timing = req.body.timing;
    const slots = req.body.slots;
    const title = req.body.title;

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
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
  const userId = decoded.id;
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

    if (decoded.id != dosage.userId) {
      return res.status(401).json({
        status: "fail",
        message: "You are not authorized to access this dose",
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

exports.getDosageOfLogedIn = async (req, res) => {
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
    const { duration, frequency, description, timing } = req.body;

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

    if (decoded.id != dosage.userId) {
      return res.status(401).json({
        status: "fail",
        message: "You are not authorized to update this dose",
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

    if (decoded.id != dosage.userId) {
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
    console.error(error);
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
    const userId = getUserIdFromRequest(req);
    const { dosageID, slotID, isCompleted } = req.body;

    const dosage = await Dosage.findOneAndUpdate(
      { userId: userId, _id: dosageID, "slots.slotID": slotID },
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
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};
