import { Router } from 'express';
import {
  createChatroom,
  getChatrooms,
} from '../controllers/chatroom.controller.js';

const chatroomRouter = Router();

chatroomRouter.get('/', getChatrooms);
chatroomRouter.post('/', createChatroom);

export default chatroomRouter;
