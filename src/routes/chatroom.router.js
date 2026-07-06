import { Router } from 'express';
import { getChatrooms } from '../controllers/chatroom.controller.js';

const chatroomRouter = Router();

chatroomRouter.get('/:id', getChatrooms);

export default chatroomRouter;
