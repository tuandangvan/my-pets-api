import mongoose from "mongoose";
import Account from "~/models/accountModel";
import { hashSync } from "bcrypt";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { compareSync } from "bcrypt";

const createAccount = async function (data) {
  const account = new Account({
    _id: new mongoose.Types.ObjectId(),
    ...data,
    password: hashSync(data.password, 8)
  });
  return account.save();
};

const findByCredentials = async function ({ email, password }) {
  const account = await Account.findOne({ email });
  if (!account) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Tài khoản chưa được đăng kí");
  }
  const isPasswordMatch = await compareSync(password, account.password);
  if (!isPasswordMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Mật khẩu không chính xác");
  }
  return account;
};

const updatePassword = async function ({ email, newPassword }) {
  const account = await Account.findOne({ email });

  if (!account) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Tài khoản chưa được đăng kí");
  }
  account.password = hashSync(newPassword, 8);
  await account.save();
  return true;
};

export const accountService = {
  createAccount,
  findByCredentials,
  updatePassword
};
