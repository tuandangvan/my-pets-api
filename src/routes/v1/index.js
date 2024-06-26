import express from "express";
import { StatusCodes } from "http-status-codes";
import { authRoute } from "./authRoute.js";
import { userRoute } from "./user/userRoute.js";
import { petRoute } from "./center/petRoute.js";
import { centerRoute } from "./center/centerRoute.js";
import { postRoute } from "./postRoute.js";
import { uploadRoute } from "./uploadRoute.js";
import { adminRoute } from "./admin/adminRoute.js";
import { chatRoute } from "./chat/chatRoute.js";
import { messageRoute } from "./chat/messageRoute.js";
import { adoptRoute } from "./adoptRoute.js";
import { notifyRoute } from "./notifyRoute.js";
import { reportRoute } from "./reportRoute.js";
import { orderRoute } from "./order/orderRoute.js";
import { paymentRoute } from "./order/paymentRoute.js";
import { voucherRoute } from "./order/voucherRoute.js";
import { reviewRoute } from "./order/reviewRoute.js";
import { statisticalRoute } from "./statisticalRoute.js";
import { followRote } from "./followRoute.js";


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
router.use("/adopt", adoptRoute);
router.use("/notify", notifyRoute);
router.use("/report", reportRoute);
router.use("/order", orderRoute);
router.use("/payment", paymentRoute);
router.use("/voucher", voucherRoute);
router.use("/review", reviewRoute);
router.use("/statistical", statisticalRoute);
router.use("/follow", followRote);
export const APIs_V1 = router;
