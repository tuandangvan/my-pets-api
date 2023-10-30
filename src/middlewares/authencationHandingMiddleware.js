import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { env } from "~/config/environment";
import ApiError from "~/utils/ApiError";
import ErorrToken from "~/messageError/erorrToken";
import ErorrAccount from "~/messageError/errorAccount";
const authencation = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ErorrToken.tokenNotFound);
    }

    const token = req.header("Authorization").replace("Bearer ", "");
    const data = verify(token, env.JWT_SECRET);
    if (!data) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ErorrToken.tokenExpired);
    }

    if (!data.id) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErorrAccount.accountNotFound);
    }

    if (req.route.path != "/refresh-token") {
      if (data.access == false)
        throw new ApiError(StatusCodes.FORBIDDEN, ErorrToken.tokenNotAccess);
    }

    if (req.route.path == "/refresh-token") {
      if (data.access == true)
        throw new ApiError(StatusCodes.FORBIDDEN, ErorrToken.tokenNotRefresh);
    }
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, error.message));
  }
};
export default authencation;
