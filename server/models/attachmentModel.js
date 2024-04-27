const mongoose = require("mongoose");

const attachmentSchema = mongoose.Schema({
  email_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Email",
    required: true,
  },
  name: { type: String, required: true },
  content_type: { type: String, required: true },
  content: { type: Buffer, required: true }, // Assuming binary content
  size: { type: Number, required: true },
  created_at: { type: Date },
});

module.exports = mongoose.model("Attachment", attachmentSchema);