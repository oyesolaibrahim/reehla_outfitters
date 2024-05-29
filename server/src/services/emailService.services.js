require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "IB_Dan Tech",
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

module.exports = sendEmail;
