import mongoose from "mongoose";
import { enums } from "~/enums/enums";
import chatModel from "~/models/chatModel";

const createChat = async function (participants) {
  const chat = new chatModel({
    _id: new mongoose.Types.ObjectId(),
    participants: participants
  });
  return await chat.save();
};
const findByPaticipants = async function (participants1, participants2) {
  const existingChat1 = await chatModel.findOne({
    participants: participants1
  });
  const existingChat2 = await chatModel.findOne({
    participants: participants2
  });
  if (existingChat1) return existingChat1;
  else if (existingChat2) return existingChat2;
  else return null;
};

const findAllChatById = async function (id, role) {
  if (role == enums.roles.USER) {
    const chats = await chatModel
      .find({ "participants.userId": id })
      .populate("participants.userId")
      .populate("participants.cennterId")
      .sort({ updatedAt: -1 })
      .lean();
    return chats;
  } else {
    const chats = await chatModel
      .find({ "participants.centerId": id })
      .populate("participants.userId")
      .populate("participants.centerId")
      .sort({ updatedAt: -1 })
      .lean();
    return chats;
  }
};
const findById = async function (chatId) {
  const chat = await chatModel.findById(chatId);
  return chat;
};

const saveMessageId = async function (chat, messageId) {
  chat.messages.push(messageId);
  return await chat.save();
};


export const chatService = {
  createChat,
  findByPaticipants,
  findAllChatById,
  findById, 
  saveMessageId,
};
