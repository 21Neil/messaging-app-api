import { updateChatroomLastMessageAt } from '../services/chatroom.service.js';
import * as messageService from '../services/message.service.js';

export const sendMessage = async (req, res, next) => {
  const roomId = +req.params.id;
  const senderId = req.user.id;
  const content = req.body.content;

  try {
    const message = await messageService.sendMessage({
      roomId,
      senderId,
      content,
    });

    await updateChatroomLastMessageAt({
      id: roomId,
      lastMessageAt: new Date(),
    });

    return res.status(200).json({ message: 'Send success', message });
  } catch (err) {
    next(err);
  }
};

export const sendImage = async (req, res, next) => {
  const roomId = +req.params.id;
  const senderId = req.user.id;
  const image = req.file;

  try {
    const message = await messageService.sendImage({
      roomId,
      senderId,
      image,
    });

    await updateChatroomLastMessageAt({
      id: roomId,
      lastMessageAt: new Date(),
    });

    return res.status(200).json({ message: 'Send success', message });
  } catch (err) {
    next(err);
  }
};

export const getImage = async (req, res, next) => {
  const roomId = +req.params.id;
  const imgKey = req.params.imgKey;

  try {
    const image = await messageService.getImage({ roomId, imgKey });

    return image.Body.pipe(res);
  } catch (err) {
    next(err);
  }
};
