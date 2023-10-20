import express from "express";
import { petController } from "~/controllers/petController";


const router = express.Router();
router.post("", petController.createPet);
router.put("/:id", petController.updatePet);
router.delete("/:id", petController.deletePet);
router.get("/", petController.getAllPets);
// router.post("/get-users", userController.findUserByNamePhoneEmail); //find user by name or phone or email
// router.post("/change-infomation", userController.findUserByNamePhoneEmail); //find user by name or phone or email

export const petRoute = router;
