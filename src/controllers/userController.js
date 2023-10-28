import { StatusCodes } from "http-status-codes";
import { enums } from "~/enums/enums";
import ErorrAccount from "~/messageError/errorAccount";
import { accountService } from "~/services/accountService";
import { userService } from "~/services/userService";
import ApiError from "~/utils/ApiError";

const createInformation = async (req, res, next) => {
  try {
    const account = await accountService.findAccountById(req.params.accountId);
    if(!account){
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        ErorrAccount.accountNotFound
      );
    }
    if (account.role == enums.roles.CENTER) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "You have registered user rights!"
      );
    }
    const infoUser = await userService.createUser({
      data: req.body,
      id: account.id
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: infoUser
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

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

const changeInfomation = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log(userId)
    const user = await userService.findUserById(userId);
    if(!user){
      throw new ApiError(StatusCodes.NOT_FOUND, Contants.userNotExist);
    }
    const users = await userService.updateUser({data: req.body, userId: userId});
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
  changeInfomation
};
