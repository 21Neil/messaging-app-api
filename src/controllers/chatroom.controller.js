import * as chatroomService from '../services/chatroom.service.js';

export const getChatrooms = async (req, res, next) => {
  try {
    const chatrooms = await chatroomService.getChatrooms({ id: req.user.id });

    return res.status(200).json(chatrooms);
  } catch (err) {
    next(err);
  }
};

export const createChatroom = async (req, res, next) => {
  try {
    const chatroom = await chatroomService.createChatroom({
      name: null,
      memberIds: [req.user.id, ...req.body.members],
    });

    return res.status(200).json({ message: 'Create success.' });
  } catch (err) {
    next(err);
  }
};
