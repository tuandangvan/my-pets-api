import mongoose from "mongoose";
import Voucher from "../models/voucherModel.js";

const createVoucher = async function (data) {
  const voucher = new Voucher({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return voucher.save();
};

const getVoucherOfCenter = async function (centerId) {
  const voucher = await Voucher.find({ createdBy: centerId });
  return voucher;
};

const applyVoucher = async function (code) {
  const voucher = await Voucher.findOne({ code: code });
  return voucher;
};

export const voucherService = {
  createVoucher,
  getVoucherOfCenter,
  applyVoucher
};
