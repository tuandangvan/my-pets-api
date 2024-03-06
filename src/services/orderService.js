import mongoose from "mongoose";
import Order from "../models/orderModel.js";

const createOrder = async function (data) {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return order.save();
};

const getOrderBySeller = async function (sellerId, typeSeller) {
  if (typeSeller === "C") {
    const orders = await Order.find({ "seller.centerId": sellerId })
      .populate("buyer", "firstName lastName avatar phoneNumber address")
      .populate("seller.centerId", "name avatar phoneNumber address")
      .populate("petId");
    return orders;
  } else {
    const orders = await Order.find({ "seller.userId": sellerId })
      .populate("buyer", "firstName lastName avatar phoneNumber address")
      .populate(
        "seller.userId",
        "firstName lastName avatar phoneNumber address"
      )
      .populate("petId");
    return orders;
  }
};

const getOrderByBuyer = async function (buyerId, statusOrder) {
  const orders = await Order.find({ buyer: buyerId, statusOrder })
    .populate("buyer", "firstName lastName avatar phoneNumber address")
    .populate("seller.userId", "firstName lastName avatar phoneNumber address")
    .populate("seller.centerId", "name  avatar phoneNumber address")
    .populate("petId");
  return orders;
};

export const orderService = {
  createOrder,
  getOrderBySeller,
  getOrderByBuyer
};
