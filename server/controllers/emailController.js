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
  const user = req.body.sender.user;
  const email = req.body.email;
  const recipient = req.body.recipient.user;
  console.log(req.body);
  try {
    const result = await Email.create({
      sender_id: user._id,
      recipient_id: recipient._id,
      subject: email.subject,
      body: email.body,
      original_language: user.preferred_language,
      translated_body: email.body,
      sent_at: new Date(),
      received_at: new Date(),
      is_deleted: false,
      is_urgent: true,
      folder: ["SENT"],
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
    // set the email's is_deleted to true
    const result = await Email.updateOne(
      { _id: req.body.emailID },
      { $set: { is_deleted: true } }
    );

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

module.exports = {
  getEmailsController,
  getAllEmailsController,
  sendEmailController,
  deleteEmailController,
//   permanentDeleteEmailController,
};
