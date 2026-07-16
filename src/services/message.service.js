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
