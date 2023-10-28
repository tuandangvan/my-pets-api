import { enums } from "~/enums/enums";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const setGender = async function (gender) {
  try {
    if (gender == "MALE") return enums.genders.MALE;
    else if(gender == "FEMALE") return enums.genders.FEMALE;
    else return enums.genders.ORTHER;
  } catch (error) {
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      error.message
    );
    next(customError);
  }
};

const setLevelPet = async function (level) {
    try {
      if (level == "URGENT") return enums.statusPet.URGENT;
      else return enums.statusPet.NORMAL;
    } catch (error) {
      const customError = new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        error.message
      );
      next(customError);
    }
  };
  
export const setEnum = {
    setGender,
    setLevelPet
};
