import mongoose from "mongoose";
import User from "../models/userModel.js";
import centerModel from "../models/centerModel.js";

const createUser = async function ({ data, id }) {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    ...data,
    accountId: id
  });
  return user.save();
};

const getAll = async function () {
  const user = await User.find()
    .populate("accountId");
  return user;
};

const findUserByAccountId = async function (accountId) {
  const user = await User.findOne({ accountId: accountId }).populate("accountId");
  return user;
};

const findInfoUserByUserId = async function (userId) {
  const user = await User.findOne({ _id: userId }).populate("accountId");
  user.accountId.password = undefined;
  return user;
};

const findUserById = async function (_id) {
  const user = await User.findOne({ _id })

  return user;
};

const getUsers = async function (data) {
  const users = User.find({
    $or: [
      { name: { $regex: data, $options: "i" } },
      { phone: data },
      { email: data }
    ]
  }).select("id name email phone address avatar");
  return users;
};

const updateUser = async function ({ data, userId }) {
  const users = User.updateOne(
    { _id: userId },
    {
      $set: { ...data }
    });
  return users;
};

const findAD = async function () {
  const users = User.find({ role: "ADMIN" });
  return users;
};

const followUser = async function (userId, userIdFL, centerIdFL) {
  var followed;
  if (userIdFL) {
    const user = await User.findOne({ _id: userId });
    user.followerUser.forEach(element => {
      if (element == userIdFL) {
        followed = true;
      }
    });
  } else {
    const user = await User.findOne({ _id: userId });
    user.followerCenter.forEach(element => {
      if (element == centerIdFL) {
        followed = true;
      }
    });
  }
  if (userIdFL) {
    if (followed) {
      const user = await User.updateOne({ _id: userId }, { $pull: { followerUser: userIdFL } });
      await User.updateOne({ _id: userIdFL }, { $pull: { followingUser: userId } });
      return "Unfollowed";
    }
    else {
      const user = await User.updateOne({ _id: userId }, { $push: { followerUser: userIdFL } });
      await User.updateOne({ _id: userIdFL }, { $push: { followingUser: userId } });
      return 'Followed';
    }
  }
  else {
    if (followed) {
      const user = await User.updateOne({ _id: userId }, { $pull: { followerCenter: centerIdFL } });
      await centerModel.updateOne({ _id: centerIdFL }, { $pull: { followingUser: userId } });
      return "Unfollowed";
    }
    else {
      const user = await User.updateOne({ _id: userId }, { $push: { followerCenter: centerIdFL } });
      await centerModel.updateOne({ _id: centerIdFL }, { $push: { followingUser: userId } });
      return "Followed";
    }
  }
}

const getMyFollow = async function (userId) {
  const user = await User.findOne({ _id: userId }).select("followingCenter followerUser");
  return user;
}

const getFollower = async function (id) {
  const user = await User.findOne({ _id: id }).select("followerUser followerCenter")
    .populate("followerUser", "id firstName lastName avatar")
    .populate("followerCenter", "id name avatar");
  if (user) {
    return user;
  }
  const center = await centerModel.findOne({ _id: id }).select("followerUser followerCenter")
    .populate("followerUser", "id firstName lastName avatar")
    .populate("followerCenter", "id name avatar");
  return center;
}

export const userService = {
  createUser,
  findUserById,
  getAll,
  getUsers,
  updateUser,
  findUserByAccountId,
  findInfoUserByUserId,
  findAD,
  followUser,
  getMyFollow,
  getFollower
};
