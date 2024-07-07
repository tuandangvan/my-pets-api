import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { env } from "../../config/environment.js";
import ErrorCenter from "../../messageError/errorCenter.js";
import ErrorPet from "../../messageError/errorPet.js";
import { centerService } from "../../services/centerService.js";
import { petService } from "../../services/petService.js";
import ApiError from "../../utils/ApiError.js";
import { token } from "../../utils/token.js";
import { validate } from "../../validate/validate.js";

const createPet = async (req, res, next) => {
  try {
    //validate
    const result = validate.petValidate(req.body);
    if (result.error) {
      res
        .status(400)
        .send({ success: false, message: result.error.details[0].message });
      return;
    }

    const getToken = await token.getTokenHeader(req);
    const account = verify(getToken, env.JWT_SECRET);

    const newPet = await petService.createPet({
      data: req.body
    });
    var centerUpdate = null;
    if (!req.body.giver) {
      centerUpdate = await centerService.addPetForCenter({
        centerId: account.centerId,
        petId: newPet.id
      });
    } else {
      centerUpdate = await centerService.addPetLinkForCenter({
        centerId: req.body.linkCenter,
        petId: newPet.id
      });
    }
    if (newPet) {
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Pet added successfully!",
        pet: newPet,
        center: centerUpdate
      });
    } else {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: "Pets cannot be added!"
      });
    }
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
    const pet = await petService.findPetById(req.params.petId);
    if (!pet) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErrorPet.petNotFound);
    }
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const center = await centerService.findCenterById(decodeToken.centerId);
    if (!center) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErrorCenter.centerNotExist);
    }
    const pets = await petService.updatePet({
      data: req.body,
      petId: pet.id
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Pets have been updated successfully!"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const petId = req.params.petId;
    const pet = await petService.findPetById(petId);
    if (!pet) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErrorPet.petNotFound);
    }
    // if (pet.statusAdopt != "NOTHING") {
    //   res.status(StatusCodes.OK).json({
    //     success: false,
    //     message: "Pets have been adopted!"
    //   });
    //   return;
    // }
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const center = await centerService.findCenterById(decodeToken.centerId);
    if (!center) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErrorCenter.centerNotExist);
    }
    await petService.deletePet(petId);
    await centerService.deletePetForCenter({
      centerId: decodeToken.centerId,
      petId: petId
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Pets have been deleted successfully!"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getAllPetOfCenter = async (req, res, next) => {
  try {
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const pets = await petService.findAllOfCenter(decodeToken.centerId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getAllPetOfCenterPermission = async (req, res, next) => {
  try {
    const pets = await petService.findAllOfCenter(req.params.centerId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getAllPet = async (req, res, next) => {
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

const getAllPetFree = async (req, res, next) => {
  try {
    const pets = await petService.findAllFree();
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getAllPetPersonal = async (req, res, next) => {
  try {
    const pets = await petService.findAllPersonal();
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const filter = async (req, res, next) => {
  const breed = req.query.breed || null;
  const color = req.query.color || null;
  const age = req.query.age || null;

  try {
    const pets = await petService.filter({ breed, color, age });
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getAllCenter = async (req, res, next) => {
  try {
    const centers = await centerService.findAllCenter();
    res.status(StatusCodes.OK).json({
      success: true,
      data: centers
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const favoritePet = async (req, res, next) => {
  try {
    const petId = req.body.petId;
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);

    await petService.favoritePet(petId, decodeToken.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "success"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const findPetFavorite = async (req, res, next) => {
  try {
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const pets = await petService.findPetFavorite(decodeToken.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getOnePet = async (req, res, next) => {
  try {
    const pet = await petService.getOnePet(req.params.petId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: pet
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
}

const getPetCenter = async (req, res, next) => {
  try {
    const pet = await petService.getPetCenter(req.params.centerId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: pet
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }

}

const getPetReduce = async (req, res, next) => {
  try {
    const pets = await petService.getPetReduce();
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }

}

const getPetBreed = async (req, res, next) => {
  try {
    const pets = await petService.getPetBreed(req.query.breed);
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }

}

const updatePriceSale = async (req, res, next) => {
  try {
    const petId = req.params.petId;
    const data = req.body;
    const pets = await petService.updatePriceSale(petId, data);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Updated successfully!"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }

}

export const petController = {
  createPet,
  getAllPetOfCenter,
  updatePet,
  deletePet,
  getAllPetOfCenterPermission,
  getAllPet,
  getAllPetPersonal,
  filter,
  getAllCenter,
  favoritePet,
  findPetFavorite,
  getOnePet,
  getPetCenter,
  getPetReduce,
  getPetBreed,
  updatePriceSale,
  getAllPetFree
};
