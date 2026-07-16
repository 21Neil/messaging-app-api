import { Router } from 'express';
import { sendMessage } from '../controllers/message.controller.js';

const messageRouter = Router({ mergeParams: true });

messageRouter.post('/', sendMessage)

export default messageRouter;
