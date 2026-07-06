import { Router } from 'express';
import authRouter from './auth.router.js';
import chatroomRouter from './chatroom.router.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/rooms', chatroomRouter)

export default apiRouter;
