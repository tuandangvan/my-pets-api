import mongoose from "mongoose";
import User from "~/models/userModel";

const createUser = async function ({data, id}) {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    ...data,
    accountId: id
  });
  return user.save();
};

const getAll = async function (accountId) {
  const user = await User.findOne({_id: accountId})
  .populate("accountId");
  return user;
};

const findUserByAccountId = async function (accountId) {
  const user = await User.findOne({accountId: accountId}).populate("accountId");
  return user;
};

const findUserById = async function (_id) {
  const user = await User.findOne({_id})

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

const updateUser = async function ({data, userId}) {
  console.log(data)
  console.log(userId)
  const users = User.updateOne(
    { _id: userId }, 
    { $set: { ...data }
  });
  return users;
};


export const userService = {
  createUser,
  findUserById,
  getAll,
  getUsers,
  updateUser,
  findUserByAccountId
};
