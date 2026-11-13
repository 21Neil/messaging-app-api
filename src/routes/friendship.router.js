import { Router } from 'express';
import {
  applyFriendship,
  checkFriendStatuses,
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
friendshipRouter.get('/statuses', checkFriendStatuses);

export default friendshipRouter;
