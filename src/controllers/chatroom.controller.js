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

    return res.status(200).json({ message: 'Create success.', chatroom });
  } catch (err) {
    next(err);
  }
};

export const updateChatroom = async (req, res, next) => {
  const id = +req.params.id;
  const { name } = req.body;

  try {
    const chatroom = await chatroomService.updateChatroom({ id, name });

    return res.status(200).json({ message: 'Update success.', chatroom });
  } catch (err) {
    next(err);
  }
};

export const joinChatroom = async (req, res, next) => {
  const roomId = +req.params.id;
  const userIds = req.body.userIds;

  try {
    const chatroom = await chatroomService.joinChatroom({ roomId, userIds });

    return res.status(200).json({ message: 'Join success.', chatroom });
  } catch (err) {
    next(err);
  }
};

export const leaveChatroom = async (req, res, next) => {
  const roomId = +req.params.id;
  const userIds = req.body.userIds;

  try {
    const chatroom = await chatroomService.leaveChatroom({ roomId, userIds });

    return res.status(200).json({ message: 'Leave success.', chatroom });
  } catch (err) {
    next(err);
  }
};

export const deleteChatroom = async (req, res, next) => {
  const roomId = +req.params.id;

  try {
    const chatroom = await chatroomService.deleteChatroom({ roomId });

    return res.status(200).json({ message: 'Delete success.', chatroom });
  } catch (err) {
    next(err);
  }
};

export const getChatroom = async (req, res, next) => {
  const roomId = +req.params.id;

  try {
    const chatroom = await chatroomService.getChatroom({ roomId });

    return res.status(200).json({ chatroom });
  } catch (err) {
    next(err);
  }
};
