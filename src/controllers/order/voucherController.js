import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import { voucherService } from "../../services/voucherService";
import moment from "moment-timezone";

const createVoucher = async (req, res, next) => {
  try {
    const data = req.body;
    const voucher = await voucherService.createVoucher(data);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Create voucher successfully!",
      voucher: voucher.code
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const getVoucherOfCenter = async (req, res, next) => {
  try {
    const vouchers = await voucherService.getVoucherOfCenter(
      req.params.centerId
    );
    res.status(StatusCodes.OK).json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const applyVoucher = async (req, res, next) => {
  try {
    const code = req.params.code;
    const voucher = await voucherService.applyVoucher(code);
    const currentDate = moment().tz("Asia/Ho_Chi_Minh");
    if (!voucher) {
      throw new Error("Voucher not found!");
    } else if (voucher.status != "active") {
      throw new Error("Voucher is not active!");
    } else if (
      !currentDate.isBetween(
        moment(voucher.startDate).add(-7, "hours"),
        moment(voucher.endDate).add(-7, "hours")
      )
    ) {
      throw new Error("Voucher is not active or expired!");
    } else if (voucher.quantity <= 0) {
      throw new Error("Voucher is out of stock!");
    } else {
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Apply voucher successfully!",
        data: voucher
      });
    }
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

export const voucherController = {
  createVoucher,
  getVoucherOfCenter,
  applyVoucher
};
