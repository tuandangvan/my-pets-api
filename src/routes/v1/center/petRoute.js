import express from "express";
import { petController } from "../../../controllers/center/petController.js";
import authencation from "../../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../../utils/rolePermission.js";
import { orderController } from "../../../controllers/order/orderController.js";


const router = express.Router();
router.post("/", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.createPet);
router.put("/:petId", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.updatePet);
router.delete("/:petId", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.deletePet);
router.get("/", authencation, authorizationMiddelware.permission(PermissionRoles.onlyCenter), petController.getAllPetOfCenter);
router.get("/:centerId", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.getAllPetOfCenterPermission);
router.get("/all/pets/center", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.getAllPet);
router.get("/all/pets/free", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.getAllPetFree);
router.get("/all/pets/personal", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.getAllPetPersonal);
router.get("/search/find", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.filter);
router.get("/centers/all", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.getAllCenter);
router.put("/favorite/pet", authencation, authorizationMiddelware.permission(PermissionRoles.onlyUser), petController.favoritePet);
router.get("/favorite/pet", authencation, authorizationMiddelware.permission(PermissionRoles.onlyUser), petController.findPetFavorite);
router.get("/one/:petId", petController.getOnePet);
router.get("/center/:centerId", authencation, authorizationMiddelware.permission(PermissionRoles.All), petController.getPetCenter);

router.get("/breed/list", orderController.getListBreed);
router.get("/sale/list", petController.getPetReduce);

router.get("/breed/list/pet", petController.getPetBreed);
router.put("/:petId/price-sale", petController.updatePriceSale);

router.get("/inventory/day", authencation, authorizationMiddelware.permission(PermissionRoles.onlyCenter), petController.petInventory);
router.get('/bestseller/breeds/type', authencation, authorizationMiddelware.permission(PermissionRoles.onlyCenter), petController.getListBreedBestSeller);

export const petRoute = router;
