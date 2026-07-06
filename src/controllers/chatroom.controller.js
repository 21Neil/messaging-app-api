import { getRoomParamsSchema } from '../schemas/auth.schema.js';
import * as chatroomService from '../services/chatroom.service.js';

export const getChatrooms = async (req, res, next) => {
  const result = getRoomParamsSchema.safeParse(req.params);

  try {
    const chatrooms = await chatroomService.getChatrooms(result.data);

    return res.status(200).json(chatrooms);
  } catch (err) {
    next(err);
  }
};
