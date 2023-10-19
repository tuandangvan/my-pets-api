import express from "express";
import { postController } from "~/controllers/postController";


const router = express.Router();
router.post("/add", postController.addPost);
router.post("/comment/:id", postController.postComment);
router.post("/comment/:id/:commentId", postController.deleteComment);
router.post("/reaction/:id", postController.addReaction);
router.post("/status-change/:id", postController.changeStatusPost);
router.get("/:id", postController.getPost);
router.get("/comment/:id", postController.getComment);
router.get("/reaction/:id", postController.getReaction);


export const postRoute = router;
