import mongoose from "mongoose";
import messageModel from "../models/messageModel.js";

const createMessage = async function (messageData) {
  const message = new messageModel(messageData);
  return await message.save();
};
const countMessage = async function (chatId) {
  const count = await messageModel.countDocuments({ chat: chatId });
  return count;
};

const findMessageByChatIdAndPage= async function(chatId, page, limit){
  const messages = await messageModel
  .find({ chat: chatId })
  .populate("sender.userId", "firstName lastName avatar")
  .populate("sender.centerId", "name avatar")
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);
  return messages;
}
export const messageService = {
  createMessage,
  countMessage,
  findMessageByChatIdAndPage
};
