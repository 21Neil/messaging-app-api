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
