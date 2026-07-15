import { prisma } from '../../lib/prisma.js';
import { createError } from '../utils/createError.js';

export const verifyChatroomMember = async (req, res, next) => {
  const roomId = +req.params.id;
  const currentUserId = req.user.id;

  try {
    const isMember = await prisma.chatroom.findUnique({
      where: {
        id: roomId,
        members: {
          some: {
            id: currentUserId,
          },
        },
      },
    });

    if (!isMember) throw createError(403, '你不是群組人員');

    next()
  } catch (err) {
    next(err)
  }
};
