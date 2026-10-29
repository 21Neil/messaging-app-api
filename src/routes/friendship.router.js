import { Router } from 'express';
import {
  applyFriendship,
  getFriends,
  getFriendshipInvitations,
  sentFriendship,
} from '../controllers/friendship.controller.js';

const friendshipRouter = Router();

friendshipRouter.get('/', getFriends);
friendshipRouter.get('/invitations', getFriendshipInvitations);
friendshipRouter.post('/', sentFriendship);
friendshipRouter.patch('/', applyFriendship);

export default friendshipRouter;
