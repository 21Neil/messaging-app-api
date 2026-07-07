import { prisma } from '../../lib/prisma.js';

export const getChatrooms = async ({ id }) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      chatroom: true,
    },
  });
};

export const createChatroom = async ({ name, memberIds }) => {
  return await prisma.chatroom.create({
    data: {
      name: name ?? null,
      members: {
        connect: memberIds.map(id => ({
          id,
        })),
      },
    },
  });
};
