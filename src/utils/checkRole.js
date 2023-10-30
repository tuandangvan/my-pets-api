import { enums } from "~/enums/enums";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const checkRoleUser = async function (role) {
  try {
    if (role == "CENTER") return enums.roles.CENTER;
    else return enums.roles.USER;
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
