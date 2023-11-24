import mongoose from "mongoose";
import Pet from "../models/petModel.js";
import { setEnum } from "../utils/setEnum.js";

const createPet = async function ({data, centerId}) {
  data.centerId = centerId;
  data.level = await setEnum.setLevelPet(data.level);
  data.gender = await setEnum.setGender(data.gender);
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
  const pets = await Pet.find({centerId: centerId});
  return pets;
};

const findPetById = async function (id) {
  const pet = Pet.findOne({_id: id});
  return pet;
};

export const petService = {
  createPet,
  updatePet,
  deletePet,
  findAllOfCenter,
  findPetById
};
