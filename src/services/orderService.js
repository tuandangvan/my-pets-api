import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import { petService } from "./petService.js";

const createOrder = async function (data) {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return order.save();
};

const getOrderBySeller = async function (sellerId, typeSeller, statusOrder) {
  if (typeSeller === "C") {
    const orders = await Order.find({
      "seller.centerId": sellerId,
      statusOrder
    })
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

const changeStatusOrder = async function (order, statusOrder) {
  var orders;
  if (statusOrder === "CONFIRMED") {
    orders = await Order.updateOne(
      { _id: order._id },
      { statusOrder, dateConfirm: new Date() }
    );
  } else if (statusOrder === "DELIVERING") {
    orders = await Order.updateOne(
      { _id: order._id },
      { statusOrder, dateDelivering: new Date() }
    );
  } else if (statusOrder === "DELIVERED") {
    orders = await Order.updateOne(
      { _id: order._id },
      { statusOrder }
    );
  }
  else if (statusOrder === "COMPLETED") {
    orders = await Order.updateOne(
      { _id: order._id },
      { statusOrder, dateCompleted: new Date() }
    );
  } else if (statusOrder === "CANCEL") {
    orders = await Order.updateOne(
      { _id: order._id },
      { statusOrder, dateCancel: new Date() }
    );
    await petService.updateStatusPaid(order.petId, "NOTHING");
  }
  return orders;
};

const getPayment = async function (orderId) {
  const orders = await Order.findOne({ _id: orderId })
    .populate("buyer", "firstName lastName avatar phoneNumber address")
    .populate("seller.userId", "firstName lastName avatar phoneNumber address")
    .populate("seller.centerId", "name  avatar phoneNumber address")
    .populate("petId", "namePet price");
  return orders;
};

const rating = async function (orderId) {
  const orders = await Order.updateOne({ _id: orderId }, { rating: true });
  return orders;
};

const getRevenue = async function (centerId, status) {
  const orders = await Order.find({ "seller.centerId": centerId, statusPayment: status })
    .populate("buyer", "firstName lastName avatar phoneNumber address")
    .populate("seller.userId", "firstName lastName avatar phoneNumber address")
    .populate("seller.centerId", "name  avatar phoneNumber address")
    .populate("petId");
  return orders;
}

const confirmPayment = async function (orderId) {
  const orders = await Order.updateOne({ _id: orderId }, { statusPayment: "PAID", datePaid: new Date() });
  return orders;
}

export const orderService = {
  createOrder,
  getOrderBySeller,
  getOrderByBuyer,
  getOrderDetailByBuyer,
  getOrderDetailBySeller,
  changeStatusOrder,
  getPayment,
  rating,
  getRevenue,
  confirmPayment
};
