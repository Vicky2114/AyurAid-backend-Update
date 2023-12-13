const mongoose = require("mongoose");

<<<<<<< HEAD
const doseSchema = mongoose.Schema({
=======
const dosageSchema = new mongoose.Schema({
>>>>>>> b7382b4ce4c127541c42ed6d53eb6321210c4943
  userId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
<<<<<<< HEAD
    required: [true, "Duration is required"],
=======
>>>>>>> b7382b4ce4c127541c42ed6d53eb6321210c4943
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
