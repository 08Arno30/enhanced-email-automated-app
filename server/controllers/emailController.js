require("dotenv").config();

const Email = require("../models/emailModel");
const sendEmail = require("../utils/sendEmail");

// get user emails
const getEmailsController = async (req, res) => {
  try {
    // return all emails for user
    const result = await Email.find({
      recipient_id: req.query.userID,
      is_deleted: false,
    });

    if (!result)
      return res.status(500).json({ message: "Something went wrong!" });

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

// get all emails
const getAllEmailsController = async (req, res) => {
  try {
    // return all emails
    const result = await Email.find();

    if (!result)
      return res.status(500).json({ message: "Something went wrong!" });

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

// send email
const sendEmailController = async (req, res) => {
  const user = req.body.sender;
  const email = req.body.email;
  const recipient = req.body.recipient;
  try {
    const result = await Email.create({
      sender_id: user._id,
      recipient_id: recipient._id,
      subject: email.subject,
      body: email.body,
      sent_at: new Date(),
      received_at: new Date(),
      is_deleted: false,
      is_urgent: req.body.isUrgent,
      folder: ["Sent"],
    });

    if (!result)
      return res.status(500).json({ message: "Something went wrong!" });

    // send email
    await sendEmail(
      recipient.email,
      user.email,
      user.email,
      email.subject,
      email.body
    );

    return res
      .status(200)
      .json({ result: result, success: true, message: "Email sent!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

// delete email to trash
const deleteEmailController = async (req, res) => {
  try {
    // go through userEmails and set the email that has the same _id as the emailID to be deleted
    const resultPromise = req.body.userEmails.map(async (email) => {
      if (email._id === req.body.emailID) {
        email.is_deleted = true;
        return email;
      } else return email;
    });
    const result = await Promise.all(resultPromise);

    if (!result)
      return res.status(500).json({ message: "Something went wrong!" });

    return res
      .status(200)
      .json({ result: result, success: true, message: "Email Moved to bin!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// permanent delete email
// const permanentDeleteEmailController = async (req, res) => {
//   try {
//     const result = await Email.deleteOne({ _id: req.body.emailID });

//     if (!result)
//       return res.status(500).json({ message: "Something went wrong!" });

//     return res
//       .status(200)
//       .json({ result: result, success: true, message: "Email Deleted!" });
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// };

const classifyEmailController = async (req, res) => {
  try {
    const subject = req.body.emailSubject;
    const body = req.body.emailBody;
    const textToClassify = subject + " " + body;

    const url = `https://next.levity.ai/api/ai/v3/${process.env.REACT_APP_LEVITY_BLOCK_ID}/classify`;
    const apiKey = process.env.REACT_APP_LEVITY_API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ textToClassify }),
    });

    if (!response.ok) {
      throw new Error(`Levity.ai API error: ${response.status}`);
    }

    const data = await response.json();

    console.log("Levity.ai classification:", data); // Example logging

    const isUrgent = data.labels.some((label) => label.value === "urgent");

    return res
      .status(200)
      .json({ isUrgent: isUrgent, message: "Email classified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error classifying email" });
  }
};

const addEmailFolderController = async (req, res) => {
  try {
    const result = await Email.updateOne(
      { _id: req.body.emailID },
      { $push: { folders: req.body.folderName } }
    );

    if (!result) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

const deleteEmailFolderController = async (req, res) => {
  try {
    const result = await Email.updateOne(
      { _id: req.body.emailID },
      { $pull: { folders: req.body.folderName } }
    );

    if (!result) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

module.exports = {
  getEmailsController,
  getAllEmailsController,
  sendEmailController,
  deleteEmailController,
  //   permanentDeleteEmailController,
  classifyEmailController,
  addEmailFolderController,
  deleteEmailFolderController,
};
