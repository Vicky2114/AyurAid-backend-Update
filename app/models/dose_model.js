const mongoose = require("mongoose");

const dosageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
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
    },
  ],
});

const Dosage = mongoose.model("Dosage", dosageSchema);

module.exports = Dosage;
