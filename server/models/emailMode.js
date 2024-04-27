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
  original_language: { type: String, required: true },
  translated_body: { type: String, required: true },
  sent_at: { type: Date },
  received_at: { type: Date },
  is_sent: { type: Boolean },
  is_urgent: { type: Boolean },
});

module.exports = mongoose.model("Email", emailSchema);

