import { Router } from 'express';
import { getImage, sendImage, sendMessage } from '../controllers/message.controller.js';
import multer from 'multer';

const messageRouter = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

messageRouter.post('/', sendMessage);
messageRouter.post('/images', upload.single('image'), sendImage);
messageRouter.get('/images/:imgKey', getImage)

export default messageRouter;
