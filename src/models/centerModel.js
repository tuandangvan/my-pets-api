import mongoose, { Schema } from "mongoose";

const centerSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account"
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      type: String,
      default: "Chưa cập nhật"
    },
    avatar: {
      type: String,
      defaul: "http://flixtv.volkovdesign.com/admin/img/user.svg"
    },
    petIds: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Pet" 
    }]
  },
  {
    timestamps: true
  }
);

const centerModel = mongoose.model("Center", centerSchema);
export default centerModel;
