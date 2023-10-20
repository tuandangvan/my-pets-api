import OTPModel from "~/models/codeOTPModel";

let intervalId;
let intervalTime = 1000; // 10 giây (30,000 mili giây)
let check = 0;
// Hàm tạo mã OTP mới
const createOTP = async function (data) {
  const otp = new OTPModel({
    email: data.email,
    code: data.code
  });
  return otp.save();
};

const checkOPTExited = async function (data) {
  try {
    // Tìm dòng dữ liệu chứa email tương ứng
    const existingOTP = await OTPModel.findOne({ email: data.email });
    if (!existingOTP) {
      return null;
    }
    // Cập nhật giá trị OTP mới
    existingOTP.code = data.code;
    existingOTP.createdAt = Date.now();
    await existingOTP.save(); // Lưu lại giá trị cập nhật

    return existingOTP; // Trả về dòng dữ liệu sau khi đã cập nhật
  } catch (error) {
    // Xử lý lỗi nếu cần
    console.error(error);
    throw error;
  }
};

const checkVerifyOTP = async function (data) {
  const otp = await OTPModel.findOne({
    email: data.email,
    code: data.code,
    used: false
  });
  if (otp) {
    otp.used = true;
    await otp.save();
    return "verifySuccess";
  } else {
    // Mã OTP không hợp lệ hoặc đã được sử dụng
    return "verifyFail";
  }
};

export const codeOTPService = {
  createOTP,
  checkVerifyOTP,
  checkOPTExited
};
