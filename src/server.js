/* eslint-disable no-console*/
import express from "express";
import { CONNECT_DATABASE, CLOSE_DATABASE } from "~/config/mongodb";
import exitHook from "async-exit-hook";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1/index";
import cors from "cors";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";

const START_SERVER = () => {
  const app = express();

  // Enable req.body json data
  app.use(express.json());
  app.use(cors());
  app.get("/", req, res =>{
    res.send("Server on")
  });

  //Use APIs v1
  app.use("/api/v1", APIs_V1);

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(
      `3. Hello ${env.AUTHOR} Back-end Server is running successfully at http://${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  // Thực hiện các tác vụ clean up trước khi dừng server
  exitHook(() => {
    console.log("4. Server is shutting down");
    CLOSE_DATABASE();
    console.log("5. Disconnected from MongoDB Cloud Atlas");
  });
};

console.log("1. Connecting to MongoDB Cloud Atlas");
CONNECT_DATABASE()
  .then(() => {
    console.log("2. Connected to MongoDb Cloud Atlas !");
  })
  .then(() => START_SERVER())
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
