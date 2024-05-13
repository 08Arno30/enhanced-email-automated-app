const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user_firstname: { type: String, required: true },
  user_lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  user_password: { type: String, required: false }, // google auth not required to have password
  preferred_language: { type: String, required: false, default: "en" },
  user_picture: { type: String },
  folders: { type: [String] },
});

module.exports = mongoose.model("User", userSchema);