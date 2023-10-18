import mongoose, { Schema } from "mongoose";

const accountSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "center", "admin"],
      default: "user"
    },
    isActive: {
      type: Boolean,
      default: true //true: isActive, false: noActive
    },
  },
  {
    timestamps: true
  }
);

const accountModel = mongoose.model("Account", accountSchema);
export default accountModel;
