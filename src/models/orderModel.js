import mongoose, { Schema } from "mongoose";

const orderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    seller: {
      typeSeller: {
        type: String,
        required: true,
        enum: ["C", "U"]
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
      },
      centerId: {
        type: Schema.Types.ObjectId,
        ref: "Center",
        default: null
      }
    },
    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet"
    },
    address: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    transportFee: {
      type: String,
      required: true,
      default: "0"
    },
    totalFee: {
      type: String,
      required: true
    },
    paymentMethods: {
      type: String,
      required: true,
      enum: ["COD", "ONLINE"] //Cash On Delivery, Online
    },
    statusOrder: {
      type: String,
      required: true,
      enum: ["PENDING", "COMFIRMED", "DELIVERING", "DELIVERED", "CANCEL"],
      default: "PENDING"
    },
    statusPayment: {
      type: String,
      required: true,
      enum: ["PENDING", "PAID", "REFUND"],
      default: "PENDING"
    },
  },

  {
    timestamps: true
  }
);

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
