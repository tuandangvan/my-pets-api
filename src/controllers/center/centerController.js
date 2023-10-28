import { StatusCodes } from "http-status-codes";
import { enums } from "~/enums/enums";
import ErorrAccount from "~/messageError/errorAccount";
import accountModel from "~/models/accountModel";
import centerModel from "~/models/centerModel";
import { accountService } from "~/services/accountService";
import { centerService } from "~/services/centerService";
import ApiError from "~/utils/ApiError";

const createInfoForCenter = async (req, res, next) => {
  try {
    const account = await accountService.findAccountById(req.params.accountId);
    if (!account)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        ErorrAccount.accountNotFound
      );

    if (account.role == enums.roles.USER)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "You have registered center rights!"
      );
    const center = await centerService.createCenter({
      data: req.body,
      id: account.id
    });
    if (center)
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: center
      });
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const updateCenter = async (req, res, next) => {
  try {
    const account = await accountModel.findOne({ email: req.body.email });

    if (account.role == "user") {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Bạn không có quyền tạo trung tâm!"
      );
    }
    const center = await centerModel.findOne({ accountId: account.id });
    const centerUpdate = await centerService.updateCenter({
      data: req.body,
      id: center.id
    });
    if (!centerUpdate) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Cập nhật thông tin không thành công!"
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Cập nhật thông tin trung tâm thành công!",
      data: centerUpdate
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

export const centerController = {
  createInfoForCenter,
  updateCenter
};
