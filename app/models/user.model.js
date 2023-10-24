const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,
  dob: Date,
  country: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;


