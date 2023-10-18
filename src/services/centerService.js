import mongoose from "mongoose";
import Center from "~/models/centerModel";

const createCenter = async function ({ data, id }) {
  const center = new Center({
    _id: new mongoose.Types.ObjectId(),
    ...data,
    accountId: id
  });
  return center.save();
};

const updateCenter = async function ({ data, id }) {
  const center = await Center.updateOne(
    { _id: id },
    {
      $set: {
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber
      }
    }
  );
  return center;
};

const addPetForCenter = async function ({ centerId, petId }) {
  const center = await Center.updateOne(
    { _id: centerId },
    {
      $push: { petIds: petId }
    }
  );
  return center;
};

export const centerService = {
  createCenter,
  updateCenter,
  addPetForCenter
};
