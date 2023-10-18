import { StatusCodes } from "http-status-codes";
import accountModel from "~/models/accountModel";
import { userService } from "~/services/userService";
import ApiError from "~/utils/ApiError";

const createInformation = async (req, res, next) => {
  try {

    const account = await accountModel.findOne({email: req.body.email});
    if(account.role=="center"){
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Bạn đã đăng kí quyền người dùng!");
    }
    const infoUser = await userService.createUser({data: req.body, id: account._id});
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: infoUser
    });
  } catch(error){
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
}

const getAllUser = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.status(StatusCodes.OK).json({
      success: true,
      data: users
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const findUserByNamePhoneEmail = async (req, res, next) => {
  try {
    const users = await userService.getUsers(req.body.search);
    res.status(StatusCodes.OK).json({
      success: true,
      data: users
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const updateUserForUser = async(req, res, next) => {
  try {
    const users = await userService.getUsers(req.body.search);
    res.status(StatusCodes.OK).json({
      success: true,
      data: users
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};
export const userController = {
  createInformation,
  getAllUser,
  findUserByNamePhoneEmail,
  updateUserForUser
};
