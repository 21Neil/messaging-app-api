import { prisma } from '../../lib/prisma.js';

export const sendMessage = async ({ roomId, senderId, content }) => {
  return await prisma.messages.create({
    data: {
      content: content,
      chatroom: {
        connect: { id: roomId },
      },
      sender: {
        connect: { id: senderId },
      },
    },
  });
};

export const getMessages = async ({ roomId, cursor }) => {
  return await prisma.messages.findMany({
    take: 50,
    skip: 1,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      }
    },
    cursor: {
      id: cursor,
    },
    orderBy: {
      createAt: 'desc',
    },
  });
};
