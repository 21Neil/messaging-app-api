import { Router } from 'express';
import {
  applyFriendship,
  deleteFriend,
  getFriends,
  getFriendshipInvitations,
  sentFriendship,
} from '../controllers/friendship.controller.js';

const friendshipRouter = Router();

friendshipRouter.get('/', getFriends);
friendshipRouter.get('/invitations', getFriendshipInvitations);
friendshipRouter.post('/', sentFriendship);
friendshipRouter.patch('/', applyFriendship);
friendshipRouter.delete('/:friendId', deleteFriend);

export default friendshipRouter;
