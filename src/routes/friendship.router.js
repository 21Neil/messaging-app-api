import { Router } from 'express';
import {
  applyFriendship,
  getFriendshipInvitations,
  sentFriendship,
} from '../controllers/friendship.controller.js';

const friendshipRouter = Router();

friendshipRouter.post('/', sentFriendship);
friendshipRouter.patch('/', applyFriendship)
friendshipRouter.get('/', getFriendshipInvitations);

export default friendshipRouter;
