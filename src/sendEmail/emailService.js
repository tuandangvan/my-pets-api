const nodemailer = require("nodemailer");

const sendMailAuthencation = async function ({ receiver, subject, text }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "foundandadoptionpets@gmail.com",
        pass: "mjgfghhzhvwoxolm"
      }
    });

    const mailOptions = {
      from: "foundandadoptionpets@gmail.com",
      to: `${receiver}`,
      subject: `${subject}`,
      text: `${text}`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        return true;
      }
    });
    return true;
  } catch (error) {}
};

export const emailService = {
  sendMailAuthencation
};
