const generateRandomPassword = async function (length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};
// Tạo mã OTP ngẫu nhiên
const generateOTP = async function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export const generate = {
  generateRandomPassword,
  generateOTP
};
