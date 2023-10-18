import mongoose from "mongoose";
import { env } from "~/config/environment";

let chatDatabaseInstance = null;

// Connect database
export const CONNECT_DATABASE = async () => {
  chatDatabaseInstance = await mongoose.connect(env.MONGODB_URI, {
    dbName: "API_PET_TEST",
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export const GET_DATABASE = () => {
  if (!chatDatabaseInstance)
    throw new Error("Must connect to Database first !");
  return chatDatabaseInstance;
};

// Đóng kết nối tới database khi cần
export const CLOSE_DATABASE = async () => {
  await chatDatabaseInstance.close();
};
