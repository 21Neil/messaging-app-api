import { Router } from "express";
import { updateUserName } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.patch('/:id/name', updateUserName);

export default userRouter
