import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import Account from "~/models/accountModel";
import Constant from "~/utils/contants";
import { jwtUtils } from "~/utils/jwtUtils";
import { verify } from "jsonwebtoken";
import { env } from "~/config/environment";
import { accountService } from "~/services/accountService";
import { sendMail } from "~/auth/authencationEmail";
import { codeOTPService } from "~/services/codeOTPService";

const signUp = async (req, res, next) => {
  try {
    const email = req.body.email;
    const oldAccount = await accountService.findAccountByEmail(email);
    if (oldAccount) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, Constant.userExist);
    }
    const newAccount = await accountService.createAccount(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Register success!"
    });

    await sendEmailAuthencation(req, res, next);
  } catch (error) {
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      error.message
    );
    next(customError);
  }
};

const signIn = async (req, res, next) => {
  try {
    const account = await accountService.findByCredentials(req.body);

    const token = await jwtUtils.generateAuthToken(account);

    const refreshToken = await jwtUtils.generateRefreshToken(account);
    const updateAccount = await Account.findByIdAndUpdate(
      account._id,
      {
        refreshToken: refreshToken
      },
      {
        new: true
      }
    );
    res.status(StatusCodes.OK).json({ account: updateAccount, token });
  } catch (error) {
    const customError = new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
    next(customError);
  }
};
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const account = await Account.findOne({ refreshToken });
    if (!account) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Refresh token không hợp lệ"
      );
    }
    await verify(refreshToken, env.JWT_SECRET);
    const accessToken = await jwtUtils.generateAuthToken(
      account._id,
      account.role
    );
    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR).message(
        "Đã có lỗi, không thể cấp access token"
      )
    );
  }
};

// Tạo mã OTP ngẫu nhiên
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmailAuthencation = async function(req, res, next) {
  try {
    const email = req.body.email;
    console.log(email)

    const oldAccount = await accountService.findAccountByEmail(email);
    if (!oldAccount) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email not exist!");
    }
    const code = generateOTP();

    const checkExits = await codeOTPService.checkOPTExited({ email: email, code: code });
    if (!checkExits) {
      await codeOTPService.createOTP({ email: email, code: code });
    }

    const sendEmail = await sendMail.sendMailAuthencation({
      toMail: email,
      subject: "Verify email address",
      text: `This is authentic security notification from Found and Adoption Pets App.\nThis is your code authencation: ${code}.\nWill expire within 5 minutes!`
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Seen otp success!"
    });
  } catch (error) {
    const customError = new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
    next(customError);
  }
};

const verifyOTP = async (req, res, next) => {
  const email = req.body.email;
  const code = req.body.code;
  const oldAccount = await accountService.findAccountByEmail(email);
  if (!oldAccount) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Email not exist!"
    });
    return;
  }

  const check = await codeOTPService.checkVerifyOTP({
    email: email,
    code: code
  });
  if (check == "verifyFail") {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Mã xác thực không hợp lệ hoặc đã hết hạn!"
    });
  } else {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Xác thực tài khoản thành công!"
    });
  }
};
function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const account = await accountService.findAccountByEmail(email);
    if (!account) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Tài khoản chưa được đăng kí"
      );
    }
    const newPassword = generateRandomPassword(8);
    const sendEmail = await sendMail.sendMailAuthencation({
      toMail: email,
      subject: "Reset Password Found and Adoption Pets App",
      text: `Hello,

      You have requested to reset your password for your account. Please follow the link below to reset your password:
      
      Reset Password: ${newPassword}
      
      If you did not request this password reset, please ignore this email.
      
      Best regards,
      Found and Adoption Pets`
    });

    await accountService.updatePassword({
      email: email,
      newPassword: newPassword
    });

    if (sendEmail) {
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Yêu cầu reset password đã được thực hiện!"
      });
    }
  } catch (error) {
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      error.message
    );
    next(customError);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const account = await accountService.findByCredentials({
      email: email,
      password: password
    });
    if (!account) {
      return;
    }
    await accountService.updatePassword({
      email: email,
      newPassword: newPassword
    });
    const sendEmail = await sendMail.sendMailAuthencation({
      toMail: email,
      subject: "Your Password Has Been Changed",
      text: `Dear [${email}],

      This is to inform you that your password for your account at Found and Adoption Pets App has been successfully changed. If you did not make this change, please contact our support team immediately.
      If you did change your password, you can ignore this message.
      Thank you for using our services.
      Sincerely,
      Found and Adoption Pets`
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Đổi mật khẩu thành công!"
    });
  } catch (error) {
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      error.message
    );
    next(customError);
  }
};

export const authController = {
  signUp,
  signIn,
  refreshToken,
  // sendEmailAuthencation,
  verifyOTP,
  forgotPassword,
  changePassword
};
