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
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Not found account!");
  }
  const isPasswordMatch = await compareSync(password, account.password);
  if (!isPasswordMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Password incorrect!");
  }
  return account;
};

const updatePassword = async function ({ email, newPassword }) {
  const account = await Account.findOne({ email });

  if (!account) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Not found account!");
  }
  account.password = hashSync(newPassword, 8);
  await account.save();
  return true;
};

const findAccountByEmail = async function (email) {
  const account = await Account.findOne({ email });
  return account;
};

const findAccountById = async function (email) {
  const account = await Account.findOne({ _id });
  return account;
};

export const accountService = {
  createAccount,
  findByCredentials,
  updatePassword,
  findAccountByEmail,
  findAccountById
};
