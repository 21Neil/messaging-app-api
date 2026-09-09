import { Router } from 'express';
import {
  updateUserAvatar,
  updateUserName,
} from '../controllers/user.controller.js';
import multer from 'multer';

const userRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

userRouter.patch('/:id/name', updateUserName);
userRouter.patch('/:id/avatar', upload.single('avatar'), updateUserAvatar);

export default userRouter;
