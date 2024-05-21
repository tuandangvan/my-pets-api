import mongoose from "mongoose";
import Pet from "../models/petModel.js";
import { setEnum } from "../utils/setEnum.js";
import { enums } from "../enums/enums.js";
import userModel from "../models/userModel.js";

const createPet = async function ({ data }) {
  data.gender = await setEnum.setGender(data.gender);
  data.adoptBy = data.centerId ? "CENTER" : "USER";

  const pet = new Pet({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return pet.save();
};

const updatePet = async function ({ data, petId }) {
  const petUpdate = await Pet.updateOne(
    { _id: petId },
    {
      $set: { ...data }
    }
  );
  return petUpdate;
};

const deletePet = async function (id) {
  const petDelete = await Pet.deleteOne({ _id: id });
  return petDelete;
};

const findAllOfCenter = async function (centerId) {
  const pets = await Pet.find({ centerId: centerId })
    // .populate("giver")
    // .populate("rescue")
    // .populate("linkCenter")
    .populate("centerId");
  // .populate("foundOwner");
  return pets;
};

const findAll = async function (userId) {
  const pets = await Pet.find({ statusPaid: "NOTHING" })
    .sort({ level: -1 })
    // .populate("giver")
    // .populate("rescue")
    // .populate("linkCenter")
    .populate("centerId");
  // .populate("foundOwner");

  pets.forEach(async (element) => {
    if (userId) {
      element.favorites = await userModel.find({
        _id: userId,
        favorites: element._id
      });
    }
  });

  return pets;
};

const findAllPersonal = async function () {
  const pets = await Pet.find({ statusPaid: "NOTHING" })
    .sort({ level: -1 })
    // .populate("giver")
    // .populate("rescue")
    // .populate("linkCenter")
    .populate("centerId");
  // .populate("foundOwner");
  return pets;
};

const findPetById = async function (id) {
  const pet = await Pet.findOne({ _id: id });
  return pet;
};

const changeStatus = async function (id, status) {
  const pet = await Pet.updateOne(
    { _id: id },
    { $set: { statusAdopt: status } }
  );
  return pet;
};

const changeOwner = async function (id, idOwnwer) {
  const pet = await Pet.updateOne(
    { _id: id },
    { $set: { foundOwner: idOwnwer } }
  );
  return pet;
};

const filter = async function ({ breed, color, age }) {
  const query = [];
  const ageArr = [];
  for (let i = parseInt(age[0]); i < parseInt(age[1]); i++) {
    ageArr.push(i.toString() + ".0");
    for (let j = 1; j < 10; j++) {
      ageArr.push((i + j / 10).toString());
    }
    if (i === parseInt(age[1]) - 1) {
      ageArr.push(parseInt(age[1]).toString() + ".0");
    }
  }

  breed && query.push({ breed: { $regex: breed, $options: "i" } });

  if (Array.isArray(color)) {
    const queryOr = [];
    color.forEach((element) => {
      queryOr.push({ color: { $regex: element, $options: "i" } });
    });
    query.push({ $or: queryOr });
  } else {
    color && query.push({ color: { $regex: color, $options: "i" } });
  }

  if (Array.isArray(age)) {
    const queryOr = [];
    ageArr.forEach((element) => {
      queryOr.push({ age: element.toString() });
    });
    query.push({ $or: queryOr });
  } else {
    age && query.push({ age: age.toString() });
  }

  const pet = await Pet.find({
    $or: [
      { statusPaid: "NOTHING" }
    ],
    $and: query
  })
    .sort({ level: -1 })
    // .populate("giver")
    // .populate("rescue")
    // .populate("linkCenter")
    .populate("centerId");
  // .populate("foundOwner");
  // console.log(pet);

  return pet;
};

const favoritePet = async function (petId, userId) {
  const petIdExist = await userModel.find({
    _id: userId,
    favorites: petId
  });
  if (petIdExist.length > 0) {
    const favorite = await userModel.updateOne(
      { _id: userId },
      {
        $pull: { favorites: petId }
      }
    );

    await Pet.updateOne(
      { _id: petId },
      {
        $pull: { favorites: userId }
      }
    );

    return favorite;
  } else {
    const favorite = await userModel.updateOne(
      { _id: userId },
      {
        $push: { favorites: petId }
      }
    );
    await Pet.updateOne(
      { _id: petId },
      {
        $push: { favorites: userId }
      }
    );
    return favorite;
  }
};

const findPetFavorite = async function (userId) {
  const petUser = await userModel.findOne({ _id: userId });
  if (petUser) {
    const pets = await Promise.all(
      petUser.favorites.map(async (element) => {
        return await Pet.findOne({ _id: element })
          // .populate("giver")
          // .populate("rescue")
          // .populate("linkCenter")
          .populate("centerId");
          // .populate("foundOwner");
      })
    );
    return pets;
  }
  return [];
};

const getOnePet = async function (id) {
  const pet = await Pet.findOne({ _id: id })
    // .populate("giver")
    // .populate("rescue")
    // .populate("linkCenter")
    .populate("centerId");
    // .populate("foundOwner");

  await Pet.updateOne(
    { _id: id },
    {
      $set: { view: pet.view + 1 }
    }
  );
  return pet;
};

const getPetCenter = async function (centerId) {
  const pet = await Pet.find({ centerId: centerId }).select("id namePet images");
  return pet;
};

const updateStatusPaid = async function (id, status) {
  await Pet.updateOne({ _id: id }, { $set: { statusPaid: status } });
}

export const petService = {
  createPet,
  updatePet,
  deletePet,
  findAllOfCenter,
  findPetById,
  findAll,
  findAllPersonal,
  changeStatus,
  changeOwner,
  filter,
  favoritePet,
  findPetFavorite,
  getOnePet,
  getPetCenter,
  updateStatusPaid
};
