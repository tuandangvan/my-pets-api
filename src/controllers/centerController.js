import { StatusCodes } from "http-status-codes";
import accountModel from "~/models/accountModel";
import centerModel from "~/models/centerModel";
import { centerService } from "~/services/centerService";
import ApiError from "~/utils/ApiError";

const createInfoForCenter = async (req, res, next) => {
    try {
      const account = await accountModel.findOne({email: req.body.email});
      if(account.role == "user"){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Bạn không có quyền tạo trung tâm!");
      }
      const center = await centerService.createCenter({data: req.body, id: account._id});
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: center
      });
    } catch(error){
      const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
      next(customError);
    }
};

const updateCenter = async(req, res, next) => {
    try {
        const account = await accountModel.findOne({email: req.body.email});

        if(account.role == "user"){
          throw new ApiError(StatusCodes.UNAUTHORIZED, "Bạn không có quyền tạo trung tâm!");
        }
        const center = await centerModel.findOne({accountId: account.id});
        console.log(center.id);
        const centerUpdate = await centerService.updateCenter({data: req.body, id: center.id});
        if(!centerUpdate){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Cập nhật thông tin không thành công!");
        }
        
        res.status(StatusCodes.OK).json({
          success: true,
          message: "Cập nhật thông tin trung tâm thành công!",
          data: centerUpdate
        });
      } catch(error){
        const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
        next(customError);
      }

};

export const centerController = {
    createInfoForCenter,
    updateCenter
};
