import mongoose from "mongoose";
import Center from "../models/centerModel.js";
import userModel from "../models/userModel.js";

const createCenter = async function ({ data, id }) {
  const center = new Center({
    _id: new mongoose.Types.ObjectId(),
    ...data,
    accountId: id
  });
  return center.save();
};

const updateCenter = async function ({ data, centerId }) {
  const center = await Center.updateOne(
    { _id: centerId },
    {
      $set: { ...data }
    }
  );
  return center;
};

const findCenterByAccountId = async function (accountId) {
  const center = await Center.findOne({ accountId: accountId }).populate(
    "accountId"
  );
  return center;
};

const addPetForCenter = async function ({ centerId, petId }) {
  const center = await Center.updateOne(
    { _id: centerId },
    {
      $push: { petIds: petId }
    }
  );
  return center;
};

const addPetLinkForCenter = async function ({ centerId, petId }) {
  const center = await Center.updateOne(
    { _id: centerId },
    {
      $push: { petLinkIds: petId }
    }
  );
  return center;
};

const deletePetForCenter = async function ({ centerId, petId }) {
  const center = await Center.updateOne(
    { _id: centerId },
    {
      $pull: { petIds: petId }
    }
  );
  return center;
};

const findCenterById = async function (id) {
  const center = await Center.findOne({ _id: id });
  return center;
};

const findInfoCenterById = async function (id) {
  const center = await Center.findOne({ _id: id }).populate("accountId");
  center.accountId.password = undefined;
  return center;
};

const findAllCenterByIdAD = async function () {
  const center = await Center.find().populate("accountId");
  return center;
};

const findAllCenter = async function () {
  const center = await Center.find().select("id name location");
  return center;
};
const followCenter = async function (centerId, userIdFL, centerIdFL) {
  var followed;
  if (userIdFL) {
    const user = await Center.findOne({ _id: centerId });
    user.followerUser.forEach(element => {
      if (element == userIdFL) {
        followed = true;
      }
    });
  } else {
    const user = await Center.findOne({ _id: centerId });
    user.followerCenter.forEach(element => {
      if (element == centerIdFL) {
        followed = true;
      }
    });
  }
  if (userIdFL) {
    if (followed) {
      const user = await Center.updateOne({ _id: centerId }, { $pull: { followerUser: userIdFL } });
      await userModel.updateOne({ _id: userIdFL }, { $pull: { followingCenter: centerId } });
      return "Unfollowed";
    }
    else {
      const user = await Center.updateOne({ _id: centerId }, { $push: { followerUser: userIdFL } });
      await userModel.updateOne({ _id: userIdFL }, { $push: { followingCenter: centerId } });
      return "Followed";
    }
  }
  else {
    if (followed) {
      const user = await Center.updateOne({ _id: centerId }, { $pull: { followerCenter: centerIdFL } });
      await Center.updateOne({ _id: centerIdFL }, { $pull: { followingCenter: centerId } });
      return "Unfollowed";
    }
    else {
      const user = await Center.updateOne({ _id: centerId }, { $push: { followerCenter: centerIdFL } });
      await Center.updateOne({ _id: centerIdFL }, { $push: { followingCenter: centerId } });
      return "Followed";
    }
  }
}

const getMyFollow = async function (userId) {
  const user = await Center.findOne({ _id: userId }).select("followingCenter followerUser");
  return user;
}

export const centerService = {
  createCenter,
  updateCenter,
  addPetForCenter,
  addPetLinkForCenter,
  findCenterById,
  findCenterByAccountId,
  deletePetForCenter,
  findInfoCenterById,
  findAllCenterByIdAD,
  findAllCenter,
  followCenter,
  getMyFollow
};
