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

    return res.status(200).json({ message: 'Send success', message });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  const roomId = +req.params.id;
  const cursor = +req.query.cursor;

  try {
    const messages = await messageService.getMessages({
      roomId,
      cursor,
    });

    return res.status(200).json({ message: 'Get success', messages });
  } catch (err) {
    next(err);
  }
};
