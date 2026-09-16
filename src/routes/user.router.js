import { Router } from 'express';
import {
  getUserAvatar,
  updateUserAvatar,
  updateUserName,
} from '../controllers/user.controller.js';
import multer from 'multer';

const userRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

userRouter.patch('/:id/name', updateUserName);
userRouter.patch('/:id/avatars', upload.single('avatar'), updateUserAvatar);
userRouter.get('/:id/avatars/:key', getUserAvatar)

export default userRouter;
