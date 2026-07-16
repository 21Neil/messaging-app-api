import { Router } from 'express';
import authRouter from './auth.router.js';
import chatroomRouter from './chatroom.router.js';
import { authenticated } from '../middleware/auth.middleware.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/chatrooms', authenticated, chatroomRouter)

export default apiRouter;
