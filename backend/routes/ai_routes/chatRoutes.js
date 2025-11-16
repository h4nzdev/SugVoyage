// routes/chatRoutes.js
import express from "express";
import { chatController } from "../../controller/ai_controller/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/chat", chatController.chatWithAI);

export default chatRouter;
