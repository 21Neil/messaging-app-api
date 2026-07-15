import { Router } from 'express';
import {
  createChatroom,
  deleteChatroom,
  getChatrooms,
  joinChatroom,
  leaveChatroom,
  updateChatroom,
} from '../controllers/chatroom.controller.js';
import { verifyChatroomMember } from '../middleware/chatroom.middleware.js';

const chatroomRouter = Router();

chatroomRouter.get('/', getChatrooms);
chatroomRouter.post('/', createChatroom);
chatroomRouter.patch('/:id', verifyChatroomMember, updateChatroom);
chatroomRouter.post('/:id/members', verifyChatroomMember, joinChatroom)
chatroomRouter.delete('/:id/members', verifyChatroomMember, leaveChatroom)

export default chatroomRouter;
