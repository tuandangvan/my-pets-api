const nodemailer = require("nodemailer");

const sendMailAuthencation = async function ({ toMail, subject, text }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "foundandadoptionpets@gmail.com",
        pass: "pvjufslocexnscob"
      }
    });

    const mailOptions = {
      from: "foundandadoptionpets@gmail.com",
      to: `${toMail}`,
      subject: `${subject}`,
      text: `${text}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return false;
      } else {
        console.log("Email sent: " + info.response);        
        return true;
      }
    });
    return true;
  } catch (error) {}
};

export const sendMail = {
  sendMailAuthencation
};
