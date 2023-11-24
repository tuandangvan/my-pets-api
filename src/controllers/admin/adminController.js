import { StatusCodes } from "http-status-codes";
import { petService } from "../../services/petService.js";
import { userService } from "../../services/userService.js";
import ApiError from "../../utils/ApiError.js";

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

const getAllPets = async (req, res, next) => {
    try {
      const pets = await petService.findAll();
      res.status(StatusCodes.OK).json({
        success: true,
        data: pets
      });
    } catch (error) {
      const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
      next(customError);
    }
  };

export const adminController = {
  getAllUser,
  getAllPets
};
