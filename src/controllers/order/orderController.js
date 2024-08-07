import { StatusCodes } from "http-status-codes";
import { env } from "../../config/environment";
import { orderService } from "../../services/orderService";
import { token } from "../../utils/token";
import { verify } from "jsonwebtoken";
import ApiError from "../../utils/ApiError";
import { voucherService } from "../../services/voucherService";
import moment from "moment-timezone";
import { petService } from "../../services/petService";
import orderModel from "../../models/orderModel";

const createOrder = async (req, res, next) => {
  try {
    const data = req.body;
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    await petService.checkPet(data.petId);
    //check voucher
    const code = req.body.code;
    if (code) {
      const voucher = await voucherService.applyVoucher(code);
      const currentDate = moment().tz("Asia/Ho_Chi_Minh");
      if (!voucher) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Voucher not found!",
        });
        return;
      } else if (voucher.status != "active") {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Voucher is not active!",
        });
        return;
      } else if (
        !currentDate.isBetween(
          moment(voucher.startDate).add(-7, "hours"),
          moment(voucher.endDate).add(-7, "hours")
        )
      ) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Voucher is not active or expired!",
        });
        return;
      } else if (voucher.used == voucher.quantity) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Voucher is out of stock!",
        });
        return;
      } else {
        if (decodeToken.userId != data.buyer) {
          throw new Error("You are not authorized to create order!");
        }
        const order = await orderService.createOrder(data);
        //update voucher
        await voucherService.updateUsedVoucher(code);
        await petService.updateStatusPaid(data.petId, "PENDING");

        res.status(StatusCodes.CREATED).json({
          success: true,
          message: "Create order successfully!",
          orderId: order._id
        });
        return;
      }
    } else {
      if (decodeToken.userId != data.buyer) {
        throw new Error("You are not authorized to create order!");
      }
      const order = await orderService.createOrder(data);
      await petService.updateStatusPaid(data.petId, "PENDING");

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Create order successfully!",
        orderId: order._id
      });
      return;
    }
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const getOrderBySeller = async (req, res, next) => {
  try {
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    var sellerId;
    var typeSeller;
    const statusOrder = req.query.statusOrder;
    if (decodeToken.role == "CENTER") {
      sellerId = decodeToken.centerId;
      typeSeller = "C";
    } else {
      sellerId = decodeToken.userId;
      typeSeller = "U";
    }
    const orders = await orderService.getOrderBySeller(
      sellerId,
      typeSeller,
      statusOrder
    );
    res.status(StatusCodes.OK).json({
      success: true,
      data: orders
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const getOrderBuyer = async (req, res, next) => {
  try {
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const buyerId = decodeToken.userId;
    const statusOrder = req.query.statusOrder;
    const orders = await orderService.getOrderByBuyer(buyerId, statusOrder);
    res.status(StatusCodes.OK).json({
      success: true,
      data: orders
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const getOrderDetailByBuyer = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const orders = await orderService.getOrderDetailByBuyer(orderId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: orders
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const getOrderDetailBySeller = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const orders = await orderService.getOrderDetailBySeller(orderId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: orders
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const changeStatusOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderModel.findOne({ _id: orderId });
    const statusOrder = req.body.statusOrder;
    await orderService.changeStatusOrder(order, statusOrder);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Change status order successfully!"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const orders = await orderService.getPayment(req.params.orderId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: orders
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const getRevenue = async (req, res, next) => {
  try {
    const status = req.query.status;
    const start = req.query.start;
    const end = req.query.end;
    const orders = await orderService.getRevenue(req.params.centerId, status, start, end);
    res.status(StatusCodes.OK).json({
      success: true,
      data: orders
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
}

const getOrderStatusPayment = async (req, res, next) => {
  try {
    const statusPayment = req.query.statusPayment;
    const year = req.query.year;

    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const centerId = decodeToken.centerId;
    const orders = await orderService.getOrderStatusPayment(centerId, statusPayment, year);
    res.status(StatusCodes.OK).json({
      success: true,
      data: orders
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }

}

const getOrderStatusPaymentYM = async (req, res, next) => {
  try {
    const statusPayment = req.query.statusPayment;
    const year = req.query.year;
    const month = req.query.month;

    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const centerId = decodeToken.centerId;
    const orders = await orderService.getOrderStatusPaymentYM(centerId, statusPayment, year, month);
    res.status(StatusCodes.OK).json({
      success: true,
      data: orders
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }

}

const confirmPayment = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    await orderService.confirmPayment(orderId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Confirm payment successfully!"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
}


const getListBreed = async (req, res, next) => {
  try {
    const breeds = await orderService.getListBreed(req.query.petType);
    res.status(StatusCodes.OK).json({
      success: true,
      data: breeds
    });

  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
}

export const orderController = {
  createOrder,
  getOrderBySeller,
  getOrderBuyer,
  getOrderDetailByBuyer,
  getOrderDetailBySeller,
  changeStatusOrder,
  getPayment,
  getRevenue,
  confirmPayment,
  getListBreed,
  getOrderStatusPayment,
  getOrderStatusPaymentYM
};
