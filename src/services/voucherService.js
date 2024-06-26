import mongoose from "mongoose";
import Voucher from "../models/voucherModel.js";

const createVoucher = async function (data) {
  const voucher = new Voucher({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return voucher.save();
};

const getVoucherOfCenter = async function (centerId, use) {
  const date = new Date();
  date.setHours(date.getHours() + 7);
  var voucher;
  if (use == 0) {
    voucher = await Voucher.find({ createdBy: centerId, startDate: { $gte: date } });
  } else if (use == 1) {
    voucher = await Voucher.find({
      createdBy: centerId,
      startDate: { $lte: date }, // start date is before or on the current date
      endDate: { $gte: date } // end date is after or on the current date
    });
  } else if (use == 2) {
    voucher = await Voucher.find({ createdBy: centerId, endDate: { $lte: date } });
  }
  else {
    voucher = await Voucher.find({ createdBy: centerId });
  }
  return voucher;
};

const applyVoucher = async function (code) {
  const voucher = await Voucher.findOne({ code: code });
  return voucher;
};

const updateUsedVoucher = async function (code) {
  const voucher = await Voucher.findOne({ code: code });
  voucher.used += 1;
  return voucher.save();
};

const findVoucherCenter = async function (centerId, type) {
  const date = new Date();
  date.setHours(date.getHours() + 7);
  const voucher = await Voucher.find({
    createdBy: centerId,
    type: type,
    startDate: { $lte: date },
    endDate: { $gte: date }
  });
  return voucher;

}
const deleteVoucher = async function (id) {
  return Voucher.findByIdAndDelete(id);
}

const updateVoucher = async function (id, data) {
  const voucher = await Voucher.updateOne({ _id: id }, { ...data });
  return voucher;
}
export const voucherService = {
  createVoucher,
  getVoucherOfCenter,
  applyVoucher,
  updateUsedVoucher,
  findVoucherCenter,
  deleteVoucher,
  updateVoucher
};
