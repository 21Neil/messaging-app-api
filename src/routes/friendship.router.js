import { Router } from 'express';
import { sentFriendship } from '../controllers/friendship.controller.js';

const friendshipRouter = Router();

friendshipRouter.post('/', sentFriendship);

export default friendshipRouter;
