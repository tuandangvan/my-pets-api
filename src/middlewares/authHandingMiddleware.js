import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { env } from "~/config/environment";
import User from "~/models/userModel";
import ApiError from "~/utils/ApiError";
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = await verify(token, env.JWT_SECRET);
    const user = User.findOne({ _id: data._id });
    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Xác thực người dùng thất bại"
      );
    }
    next();
  } catch (error) {
    next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Không có thông tin xác thực người dùng"
      )
    );
  }
};
export default auth;
