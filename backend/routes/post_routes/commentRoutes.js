// routes/commentRoutes.js
import express from "express";
import { CommentController } from "../../controller/post_controller/commentController.js";

const commentRouter = express.Router();

// Comment routes
commentRouter.post("/posts/:postId/comments", CommentController.addComment);
commentRouter.get("/posts/:postId/comments", CommentController.getPostComments);
commentRouter.get("/comments/:commentId", CommentController.getCommentById);
commentRouter.get(
  "/comments/:commentId/replies",
  CommentController.getCommentReplies
);
commentRouter.put("/comments/:commentId", CommentController.updateComment);
commentRouter.delete("/comments/:commentId", CommentController.deleteComment);
commentRouter.post("/comments/:commentId/like", CommentController.likeComment);
commentRouter.get(
  "/posts/:postId/comments/count",
  CommentController.getCommentCount
);

export default commentRouter;
