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
                  equals: id
                }
              }
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
