import { accountModel } from "~/models/accountModel";
import ApiError from "~/utils/ApiError";

const checkRoleUser = async function(email) {
    try {
      const account = await accountModel.findOne({email});
      
      res.status(StatusCodes.CREATED).json({
          success: true,
          message: "Thêm thú cưng thành công!",
          data: newPet
      });
    } catch (error) {
      const customError = new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        error.message
      );
      next(customError);
    }
  };
  
  export const checkRole = {
    checkRoleUser
  };
  