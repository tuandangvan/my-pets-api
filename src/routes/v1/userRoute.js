import express from "express";
import { userController } from "~/controllers/userController";


const router = express.Router();
router.post("/add-information", userController.createInformation);
router.get("/get-all", userController.getAllUser);
router.post("/get-users", userController.findUserByNamePhoneEmail); //find user by name or phone or email
router.post("/change-information", userController.findUserByNamePhoneEmail); //find user by name or phone or email

export const userRoute = router;
