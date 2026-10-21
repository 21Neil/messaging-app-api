import { Router } from 'express';
import { applyFriendship, sentFriendship } from '../controllers/friendship.controller.js';

const friendshipRouter = Router();

friendshipRouter.post('/', sentFriendship);
friendshipRouter.patch('/', applyFriendship)

export default friendshipRouter;
