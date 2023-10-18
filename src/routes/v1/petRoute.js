import express from "express";
import { petController } from "~/controllers/petController";


const router = express.Router();
router.post("/add", petController.createPet);
router.post("/update/:id", petController.updatePet);
router.post("/delete/:id", petController.deletePet);
router.get("/get-all", petController.getAllPets);
// router.post("/get-users", userController.findUserByNamePhoneEmail); //find user by name or phone or email
// router.post("/change-infomation", userController.findUserByNamePhoneEmail); //find user by name or phone or email

export const petRoute = router;
