const mongoose = require("mongoose");

const dosageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
      slotID: {
        type: String,
        required: true,
      },
    },
  ],
});

const Dosage = mongoose.model("Dosage", dosageSchema);

module.exports = Dosage;
