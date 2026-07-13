import { Router } from 'express';
import {
  createChatroom,
  getChatrooms,
  updateChatroom,
} from '../controllers/chatroom.controller.js';

const chatroomRouter = Router();

chatroomRouter.get('/', getChatrooms);
chatroomRouter.post('/', createChatroom);
chatroomRouter.patch('/:id', updateChatroom)

export default chatroomRouter;
