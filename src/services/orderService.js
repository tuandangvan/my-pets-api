import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import { petService } from "./petService.js";
import centerModel from "../models/centerModel.js";

const createOrder = async function (data) {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return order.save();
};

const getOrderBySeller = async function (sellerId, typeSeller, statusOrder) {
  if (typeSeller === "C") {

    if (statusOrder === "COMPLETED") {
      const orders = await Order.find({
        "seller.centerId": sellerId,
        $or: [{ statusOrder: "COMPLETED" }, { statusOrder: "DELIVERED" }]
      })
        .populate("buyer", "firstName lastName avatar phoneNumber address")
        .populate("seller.centerId", "name avatar phoneNumber address")
        .populate("petId")
        .populate("petId.centerId");
      return orders;
    }
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
    if (statusOrder === "COMPLETED") {
      const orders = await Order.find({
        "seller.centerId": sellerId,
        $or: [{ statusOrder: "COMPLETED" }, { statusOrder: "DELIVERED" }]
      })
        .populate("buyer", "firstName lastName avatar phoneNumber address")
        .populate("seller.centerId", "name avatar phoneNumber address")
        .populate("petId")
        .populate("petId.centerId");
      return orders;
    }
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
  if (statusOrder === "COMPLETED") {
    const orders = await Order.find({
      buyer: buyerId,
      $or: [{ statusOrder: "COMPLETED" }, { statusOrder: "DELIVERED" }]
    })
      .populate("buyer", "firstName lastName avatar phoneNumber address")
      .populate("seller.centerId", "name avatar phoneNumber address")
      .populate("petId")
      .populate("petId.centerId");
    return orders;
  }
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

const getListBreed = async function (type) {
  var breeds = [];
  if (type == "Dog") {
    breeds = ["Chó Alaska", "Chó Bắc Kinh", "Chó Beagle", "Chó Becgie",
      "Chó Chihuahua", "Chó Corgi", "Chó Dachshund", "Chó Golden", "Chó Husky",
      "Chó Phốc Sóc", "Chó Poodle", "Chó Pug", "Chó Samoyed", "Chó Shiba", "Chó cỏ", "Chó khác"];
  } else {
    breeds = ["Mèo Ba Tư", "Mèo Ai Cập", "Mèo Anh lông dài", "Mèo Xiêm",
      "Mèo Munchkin", "Mèo Ragdoll", "Mèo mướp", "Mèo vàng", "Mèo mun", "Mèo khác"];
  }

  const orderPet = await Order.find({ statusOrder: "COMPLETED" }).populate("petId", "breed view").select("petId");

  var listBreed = [];

  for (let i = 0; i < breeds.length; i++) {
    var sold = 0;
    var view = 0;
    for (let j = 0; j < orderPet.length; j++) {
      if (orderPet[j].petId.breed === breeds[i]) {
        sold++;
        view += orderPet[j].petId.view;
      }
    }
    listBreed.push({ breed: breeds[i], sold: sold, view: view });
  }
  //sắp xếp giảm dần theo lượt bán và lượt xem
  // listBreed.sort((a, b) => {
  //   if (b.sold - a.sold === 0) {
  //     return b.view - a.view; // sort by count_viewed if count_sold is equal
  //   }
  //   return b.sold - a.sold;
  // });
  return listBreed;
}

const getCenterHot = async function () {
  const listCenter = await centerModel.find({}).select("_id name avatar rating followerUser followerCenter");

  const orderPet = await Order.find({ statusOrder: "COMPLETED" });

  var listCenters = [];
  for (let i = 0; i < listCenter.length; i++) {
    var sold = 0;
    for (let j = 0; j < orderPet.length; j++) {
      if (listCenter[i].id == orderPet[j].seller.centerId) {
        sold++;
      }
    }
    listCenters.push({
      centerId: listCenter[i]._id,
      avatar: listCenter[i].avatar,
      name: listCenter[i].name,
      rating: listCenter[i].rating,
      sold: sold,
      followerUser: listCenter[i].followerUser,
      followerCenter: listCenter[i].followerCenter
    });

  }
  listCenters.sort((a, b) => {
    if (b.sold - a.sold === 0) {
      return b.rating - a.rating;
    }
    return b.sold - a.sold;
  });
  return listCenters;

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
  confirmPayment,
  getListBreed,
  getCenterHot
};
