import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const messageRouter = Router({ mergeParams: true });

messageRouter.post('/', sendMessage);
messageRouter.get('/', getMessages);

export default messageRouter;
