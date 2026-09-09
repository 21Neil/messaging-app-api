import { Router } from 'express';
import authRouter from './auth.router.js';
import chatroomRouter from './chatroom.router.js';
import { authenticated } from '../middleware/auth.middleware.js';
import userRouter from './user.router.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/chatrooms', authenticated, chatroomRouter);
apiRouter.use('/users', authenticated, userRouter);

export default apiRouter;
