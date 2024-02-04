import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { env } from "../config/environment.js";
import ApiError from "../utils/ApiError.js";
import ErrorToken from "../messageError/errorToken.js";
import ErrorAccount from "../messageError/errorAccount.js";
const authencation = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorToken.tokenNotFound);
    }

    const token = req.header("Authorization").replace("Bearer ", "");
    const data = verify(token, env.JWT_SECRET);
    if (!data) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorToken.tokenExpired);
    }

    if (!data.id) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErrorAccount.accountNotFound);
    }

    if (req.route.path != "/refresh-token") {
      if (data.access == false)
        throw new ApiError(StatusCodes.FORBIDDEN, ErrorToken.tokenNotAccess);
    }

    if (req.route.path == "/refresh-token") {
      if (data.access == true)
        throw new ApiError(StatusCodes.FORBIDDEN, ErrorToken.tokenNotRefresh);
    }
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, error.message));
  }
};
export default authencation;
