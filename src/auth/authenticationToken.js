import { Jwt } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { verify } from "jsonwebtoken";
import { env } from "~/config/environment";
import ErorrToken from "~/messageError/erorrToken";

const checkExpireAccessToken = async function (accessToken) {
  try {
    const checkAccessToken = await verify(accessToken, env.JWT_SECRET);
    if (checkAccessToken) return checkAccessToken;
    else {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ErorrToken.tokenExpired);
    }
  } catch (error) {
    const customError = new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        error.message
      );
      return customError;
  }
};

export const authencationToken = {
  checkExpireAccessToken
};
