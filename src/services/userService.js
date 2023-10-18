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

const getAll = async function () {
  const user = await User.findOne({_id: "652709069659dedef8c0addf"})
  .populate("accountId").select("_id accountId name phone");

  console.log(user.accountId.email);
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

const updateUser = async function (data) {
  const users = User.updateOne(
    { email: data.email }, 
    { $set: { ...data }
  });
  return users;
};


export const userService = {
  createUser,
  getAll,
  getUsers,
  updateUser
};
