import { contentEmail } from "../utils/contentEmail.js";

const nodemailer = require("nodemailer");

const sendMailAuthencation = async function ({
  receiver,
  subject,
  purpose,
  firstName,
  lastName,
  require,
  success,
  text
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "foundandadoptionpets@gmail.com",
        pass: "mjgfghhzhvwoxolm"
      }
    });

    let content;
    if (text != null) {
      content = await contentEmail.htmlSendCode({
        purpose: purpose,
        firstName: firstName,
        lastName: lastName,
        require: require,
        success: success,
        code: text
      });
    } else {
      content = await contentEmail.htmlSendAccount({
        firstName: firstName,
        lastName: lastName
      });
    }

    const mailOptions = {
      from: "foundandadoptionpets@gmail.com",
      to: `${receiver}`,
      subject: `${subject}`,
      html: `${content}`
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
