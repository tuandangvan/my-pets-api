import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { env } from "~/config/environment";
import ApiError from "~/utils/ApiError";
import Contants from "~/utils/contants";
const authencation = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = verify(token, env.JWT_SECRET);
    console.log(data)
    if(!data){
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        Contants.tokenExpired
      );
    }
  
    if (!data.id) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        Contants.userNotExist
      );
    }
    next();
  } catch (error) {
    next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        error.message
      )
    );
  }
};
export default authencation;
