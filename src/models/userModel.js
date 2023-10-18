import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      default: ""
    },
    address: {
      type: String,
      default: "Chưa cập nhật"
    },
    avatar: {
      type: String,
      defaul: "http://flixtv.volkovdesign.com/admin/img/user.svg"
    },
    experience: {
      type: Number,
      required: true,
      default: 0
    }, //0: chưa có kinh nghiệm, 1: đã có kiến thức về y tế
    favorites: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        petId: {
          type: Schema.Types.ObjectId,
          ref: "Pet"
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
