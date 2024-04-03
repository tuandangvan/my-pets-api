import mongoose, { Schema } from "mongoose";
const voucherSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    code: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enums: ["Product", "Shipping", "All"],
      default: "Product"
    },
    discount: {
      type: Number,
      default: 0
    },
    maxDiscount: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: "active"
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    used: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);
const Voucher = mongoose.model("Voucher", voucherSchema);
export default Voucher;
