const mongoose = require("mongoose");

const doseSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    required: [true, "Duration is required"],
  },
  frequency: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timing: {
    type: [String],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slots: [
    {
      title: {
        type: String,
        required: true,
      },
      subTitle: {
        type: String,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
      slotID: {
        type: String,
        required: true,
      },
    },
  ],
});

const Dosage = mongoose.model("Dosage", doseSchema);

module.exports = Dosage;
