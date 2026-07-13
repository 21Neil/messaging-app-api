import { prisma } from '../../lib/prisma.js';

export const getChatrooms = async ({ id }) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      chatroom: {
        include: {
          members: {
            where: {
              id: {
                not: {
                  equals: id,
                },
              },
            },
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
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

export const updateChatroom = async ({ id, name }) => {
  return await prisma.chatroom.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

export const joinChatroom = async ({ roomId, userIds }) => {
  return await prisma.chatroom.update({
    where: {
      id: roomId,
    },
    data: {
      members: {
        connect: userIds.map(id => ({ id })),
      },
    },
  });
};
