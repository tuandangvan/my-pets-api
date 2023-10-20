import mongoose from "mongoose";
import Pet from "~/models/petModel";

const createPet = async function (data) {
  const pet = new Pet({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return pet.save();
};

const updatePet = async function ({ data, id }) {
  const petUpdate = await Pet.updateOne(
    { _id: id },
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

const findAll = async function () {
  const pet = Pet.find();
  return pet;
};

const findPetById = async function (id) {
  const pet = Pet.findOne({_id: id});
  return pet;
};

export const petService = {
  createPet,
  updatePet,
  deletePet,
  findAll,
  findPetById
};
