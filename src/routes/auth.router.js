import { Router } from 'express';
import { login, logout, me, register } from '../controllers/auth.controller.js';
import { authenticated } from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.delete('/logout', logout);
authRouter.get('/me', authenticated, me);

export default authRouter;
