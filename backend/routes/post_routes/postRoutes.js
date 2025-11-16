import express from "express";
import { PostController } from "../../controller/post_controller/postController.js";
import { uploadImages } from "../../middleware/upload.js";

const postRouter = express.Router();

// All routes are public for simplicity
postRouter.post("/", uploadImages, PostController.createPost);
postRouter.get("/", PostController.getPosts);
postRouter.get("/user/:userId", PostController.getUserPosts);
postRouter.get("/:id", PostController.getPostById);
postRouter.put("/:id", PostController.updatePost);
postRouter.delete("/:id", PostController.deletePost);
postRouter.post("/:id/like", PostController.likePost);

export default postRouter;
