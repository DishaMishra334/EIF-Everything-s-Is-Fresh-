// backend/Routes/userRoutes.js

import express from "express";
// Correct the import to match the lowercase function name
import { registerUser, loginUser, getUserOrders, adminlogin } from "../controllers/userController.js"; 
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post('/admin', adminlogin); // Add this line to define the admin login route
userRouter.get('/orders', authMiddleware, getUserOrders);

export default userRouter;
