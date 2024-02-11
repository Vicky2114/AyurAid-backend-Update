const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Provide Valid email"],
  },
  country: {
    type: String,
  },
  dob: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  verifyEmail: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isDiabetes: {
    type: Boolean,
    default: false,
  },
  heart: {
    type: String,
  },
  lungs: {
    type: String,
  },
  liver: {
    type: String,
  },
  allergies: {
    type: Array,
  },
  bmi: {
    type: Number,
  },
  degree: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  bookmarks: [
    {
      blogId: {
        type: String,
      },
    },
  ],
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.authenticate = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 20 * 60 * 1000;
  return resetToken;
};

userSchema.methods.authenticate = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
