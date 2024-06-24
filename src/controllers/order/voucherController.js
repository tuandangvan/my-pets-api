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
      data: voucher
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const getVoucherOfCenter = async (req, res, next) => {
  try {
    const use = req.query.use;
    const centerId = req.params.centerId;
    const vouchers = await voucherService.getVoucherOfCenter(
      centerId, use
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
    } else if (voucher.used == voucher.quantity) {
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

const findVoucherCenter = async (req, res, next) => {
  try {
    const centerId = req.params.centerId;
    const type = req.query.type;
    const voucher = await voucherService.findVoucherCenter(centerId, type);

    res.status(StatusCodes.OK).json({
      success: true,
      data: voucher
    });

  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
}

const deleteVoucher = async (req, res, next) => {
  try {
    const id = req.params.id;
    await voucherService.deleteVoucher(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Delete voucher successfully!"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
}

export const voucherController = {
  createVoucher,
  getVoucherOfCenter,
  applyVoucher,
  findVoucherCenter,
  deleteVoucher
};
