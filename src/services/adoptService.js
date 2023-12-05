import mongoose from "mongoose";
import Adopt from "../models/adoptModel.js";

const createAdopt = async function ({ data, id }) {
  const adopt = new Adopt({
    _id: new mongoose.Types.ObjectId(),
    ...data,
    userRequest: id
  });
  return adopt.save();
};

const findAdoptById = async function (id) {
  const adopt = await Adopt.findOne({ _id: id });
  return adopt;
};

const changeStatus = async function (id, statusAdopt) {
  const adopt = await Adopt.updateOne(
    { _id: id },
    { $set: { statusAdopt: statusAdopt } }
  );
  return adopt;
};

const cancelledReason = async function (id, isCenter, reason) {
  if (isCenter) {
    const adopt = await Adopt.updateOne(
      { _id: id },
      {
        $set: { cancelledReasonCenter: reason }
      }
    );
    return adopt;
  } else {
    const adopt = await Adopt.updateOne(
      { _id: id },
      {
        $set: { cancelledReasonUser: reason }
      }
    );
    return adopt;
  }
};

const findAdoptUserCancel = async function (userId, petId) {
  const adopt = await Adopt.findOne({
    userRequest: userId,
    petAdopt: petId,
    statusAdopt: "PENDING"
  });
  return adopt;
};

export const adoptService = {
  createAdopt,
  findAdoptById,
  changeStatus,
  cancelledReason,
  findAdoptUserCancel
};
