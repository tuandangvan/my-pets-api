import { StatusCodes } from "http-status-codes";
import { env } from "../../config/environment";
import { orderService } from "../../services/orderService";
import { token } from "../../utils/token";
import { verify } from "jsonwebtoken";
import ApiError from "../../utils/ApiError";

const createOrder = async (req, res, next) => {
  try {
    const data = req.body;
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);

    if (decodeToken.userId != data.buyer) {
      throw new Error("You are not authorized to create order!");
    }

    const order = await orderService.createOrder(data);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Create order successfully!",
      orderId: order._id
    });
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
    const orders = await orderService.getOrderBySeller(sellerId, typeSeller, statusOrder);
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

export const orderController = {
  createOrder,
  getOrderBySeller,
  getOrderBuyer,
  getOrderDetailByBuyer
};
