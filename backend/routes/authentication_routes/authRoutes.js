import express from "express";
import { AuthController } from "../../controller/auth_controller/authentication.js";

const authRouter = express.Router();

// NEW ROUTE - Send verification code
authRouter.post("/send-verification", AuthController.sendVerification);

// EXISTING ROUTES
authRouter.post("/register", AuthController.register); // Now requires verificationCode
authRouter.post("/login", AuthController.login);
authRouter.get("/profile/:userId", AuthController.getProfile);
authRouter.put("/profile/:userId", AuthController.updateProfile);
authRouter.get("/users", AuthController.getAllUsers);

export default authRouter;
