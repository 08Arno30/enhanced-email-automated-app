const express = require("express");
const {
  getEmailsController,
  getAllEmailsController,
  sendEmailController,
  deleteEmailController,
  permanentDeleteEmailController,
} = require("../controllers/emailController");

const router = express.Router();

// Get All User Emails
router.get("/getEmails", getEmailsController);

// Get All Emails
router.get("/getAllEmails", getAllEmailsController);

// Send Email
router.post("/sendEmail", sendEmailController);

// Delete Email
router.delete("/deleteEmail", deleteEmailController);

// Permanent Delete Email
// router.delete("/permanentDeleteEmail", permanentDeleteEmailController);

module.exports = router;
