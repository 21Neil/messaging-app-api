import { Router } from 'express';
import {
  getUserAvatar,
  updateUserAvatar,
  updateUserName,
  updateUserPassword,
} from '../controllers/user.controller.js';
import multer from 'multer';

const userRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

userRouter.patch('/name', updateUserName);
userRouter.patch('/avatars', upload.single('avatar'), updateUserAvatar);
userRouter.get('/avatars/:key', getUserAvatar)
userRouter.patch('/password', updateUserPassword);

export default userRouter;
