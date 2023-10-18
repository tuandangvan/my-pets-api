import mongoose, { Schema } from "mongoose";

const otpSchema = mongoose.Schema({
  email: {
    type: String
  },
  code: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  used: {
    type: Boolean,
    default: false
  }
});
const codeOPTModel = mongoose.model("OTP", otpSchema);
export default codeOPTModel;
