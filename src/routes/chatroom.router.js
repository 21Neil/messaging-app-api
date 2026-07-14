import { Router } from 'express';
import {
  createChatroom,
  getChatrooms,
  joinChatroom,
  leaveChatroom,
  updateChatroom,
} from '../controllers/chatroom.controller.js';

const chatroomRouter = Router();

chatroomRouter.get('/', getChatrooms);
chatroomRouter.post('/', createChatroom);
chatroomRouter.patch('/:id', updateChatroom);
chatroomRouter.post('/:id/members', joinChatroom)
chatroomRouter.delete('/:id/members', leaveChatroom)

export default chatroomRouter;
