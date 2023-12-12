const mongoose = require("mongoose");

<<<<<<< HEAD
const dosageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
=======
const doseSchema = mongoose.Schema({
  userId: {
    type: String,
>>>>>>> 0dfcf3c3320df59a6b5792ebe9f8375e1a410158
    required: true,
  },
  duration: {
    type: Number,
<<<<<<< HEAD
    required: true,
=======
    required: [true, "Duration is required"],
>>>>>>> 0dfcf3c3320df59a6b5792ebe9f8375e1a410158
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
