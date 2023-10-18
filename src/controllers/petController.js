import { StatusCodes } from "http-status-codes";
import accountModel from "~/models/accountModel";
import centerModel from "~/models/centerModel";
import { centerService } from "~/services/centerService";
import { petService } from "~/services/petService";
import ApiError from "~/utils/ApiError";

const createPet = async (req, res, next) => {
  try {
    const role = req.body.role;
    if (role == "user") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Bạn không có quyền này!");
    }
    const center = await centerModel.findOne({ _id: req.body.centerId });
    if (!center) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy trung tâm!");
    }
    const newPet = await petService.createPet(req.body);
    const centerUpdate = await centerService.addPetForCenter({
      centerId: req.body.centerId,
      petId: newPet.id
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Thêm thú cưng thành công!",
      pet: newPet,
      center: centerUpdate
    });
  } catch (error) {
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      error.message
    );
    next(customError);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const role = req.body.role;
    if (role == "user") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Bạn không có quyền này!");
    }

    const pets = await petService.updatePet({data: req.body, id: req.params.id});
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Cập nhật thú cưng thành công!",
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const role = req.body.role;
    if (role == "user") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Bạn không có quyền này!");
    }

    const pets = await petService.deletePet(req.params.id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Xóa thú cưng thành công!",
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getAllPets = async (req, res, next) => {
  try {
    const pets = await petService.getAll();
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

export const petController = {
  createPet,
  getAllPets,
  updatePet,
  deletePet
};
