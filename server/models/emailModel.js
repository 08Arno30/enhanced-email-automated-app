const mongoose = require("mongoose");

const emailSchema = mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  sent_at: { type: Date },
  received_at: { type: Date },
  is_deleted: { type: Boolean },
  is_urgent: { type: Boolean },
  folders: { type: [String] },
});

module.exports = mongoose.model("Email", emailSchema);

