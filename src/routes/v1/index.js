import express from "express";
import { StatusCodes } from "http-status-codes";
import { authRoute } from "./authRoute";
import { userRoute } from "./user/userRoute";
import { petRoute } from "./center/petRoute";
import { centerRoute } from "./center/centerRoute";
import { postRoute } from "./postRoute";
import { uploadRoute } from "./uploadRoute";
import { adminRoute } from "./admin/adminRoute";
import { chatRoute } from "./chat/chatRoute";
import { messageRoute } from "./chat/messageRoute";


const router = express.Router();

// Check APIs v1/status
router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "API v1 are ready to use!",
    code: StatusCodes.OK
  });
});

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/pet", petRoute);
router.use("/center", centerRoute);
router.use("/post", postRoute);
router.use("/upload", uploadRoute);
router.use("/admin", adminRoute);
router.use("/chat", chatRoute);
router.use("/message", messageRoute);

export const APIs_V1 = router;
