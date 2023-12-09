const mongoose = require("mongoose");

const doseSchema = mongoose.Schema({
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  frequency: {
    type: Number,
    required: [true, "Frequency is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  timing: {
    type: [String],
    required: [true, "Timing is required"],
  },
});

const Dosage = mongoose.model("Dosage", doseSchema);
module.exports = Dosage;
