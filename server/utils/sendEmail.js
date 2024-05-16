require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (send_to, sent_from, reply_to, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: `${process.env.REACT_APP_GOOGLE_APP_USER}`,
      pass: `${process.env.REACT_APP_GOOGLE_APP_PASSWORD}`,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: body,
    };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
};

module.exports = sendEmail;
