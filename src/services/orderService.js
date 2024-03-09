import mongoose from "mongoose";
import Order from "../models/orderModel.js";

const createOrder = async function (data) {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return order.save();
};

const getOrderBySeller = async function (sellerId, typeSeller, statusOrder) {
  if (typeSeller === "C") {
    const orders = await Order.find({ "seller.centerId": sellerId, statusOrder })
      .populate("buyer", "firstName lastName avatar phoneNumber address")
      .populate("seller.centerId", "name avatar phoneNumber address")
      .populate("petId")
      .populate("petId.centerId");
    return orders;
  } else {
    const orders = await Order.find({ "seller.userId": sellerId, statusOrder })
      .populate("buyer", "firstName lastName avatar phoneNumber address")
      .populate(
        "seller.userId",
        "firstName lastName avatar phoneNumber address"
      )
      .populate("petId")
      .populate("petId.centerId");
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

const getOrderDetailByBuyer = async function (orderId) {
  const orders = await Order.findOne({ _id: orderId })
    .populate("buyer", "firstName lastName avatar phoneNumber address")
    .populate("seller.userId", "firstName lastName avatar phoneNumber address")
    .populate("seller.centerId", "name  avatar phoneNumber address")
    .populate("petId");
  return orders;
};

const getOrderDetailBySeller = async function (orderId) {
  const orders = await Order.findOne({ _id: orderId })
    .populate("buyer", "firstName lastName avatar phoneNumber address")
    .populate("seller.userId", "firstName lastName avatar phoneNumber address")
    .populate("seller.centerId", "name  avatar phoneNumber address")
    .populate("petId");
  return orders;
};

export const orderService = {
  createOrder,
  getOrderBySeller,
  getOrderByBuyer,
  getOrderDetailByBuyer,
  getOrderDetailBySeller
};
