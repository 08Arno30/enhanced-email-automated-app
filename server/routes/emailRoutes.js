const express = require("express");
const {
  getEmailsController,
  getAllEmailsController,
  sendEmailController,
  deleteEmailController,
  classifyEmailController,
  addEmailFolderController,
  deleteEmailFolderController,
  // permanentDeleteEmailController,
} = require("../controllers/emailController");

const router = express.Router();

// Get All User Emails
router.get("/getEmails", getEmailsController);

// Get All Emails
router.get("/getAllEmails", getAllEmailsController);

// Send Email
router.post("/sendEmail", sendEmailController);

// Classify Email
router.post("/classifyEmail", classifyEmailController);

// Delete Email to Trash
router.put("/deleteEmail", deleteEmailController);

// Add Email to Folder
router.put("/addEmailFolder", addEmailFolderController);

// Delete Email from Folder
router.put("/deleteEmailFolder", deleteEmailFolderController);

// Permanent Delete Email
// router.delete("/permanentDeleteEmail", permanentDeleteEmailController);

module.exports = router;
