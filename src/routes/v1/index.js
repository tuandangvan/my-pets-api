import express from "express";
import { StatusCodes } from "http-status-codes";
import { authRoute } from "./authRoute";
import { userRoute } from "./userRoute";
import { petRoute } from "./petRoute";
import { centerRoute } from "./centerRoute";

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

export const APIs_V1 = router;
