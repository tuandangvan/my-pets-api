import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const getTokenHeader = async function(req) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    return token;
  } catch (error) {
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      error.message
    );
    // return customError;
  }
};

export const token = {
    getTokenHeader
};
