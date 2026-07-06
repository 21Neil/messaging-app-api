import { prisma } from '../../lib/prisma.js';

export const getChatrooms = async data => {
  return await prisma.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      chatroom: true,
    },
  });
};
