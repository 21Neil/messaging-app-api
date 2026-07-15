import { prisma } from '../../lib/prisma.js';
import { createError } from '../utils/createError.js';

const checkIsMember = (roomId, currentUserId) => {
  return prisma.chatroom.findUnique({
    where: {
      id: roomId,
      members: {
        some: {
          id: currentUserId,
        },
      },
    },
  });
};

const checkIsExisting = (roomId, userIds) => {
  return prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
      chatroom: {
        some: {
          id: roomId,
        },
      },
    },
    select: {
      name: true,
    },
  });
};

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

export const joinChatroom = async ({ roomId, currentUserId, userIds }) => {
  const isMember = await checkIsMember(roomId, currentUserId);

  if (!isMember) throw createError(403, '你不是群組人員');

  const isExisting = await checkIsExisting(roomId, userIds);

  if (isExisting.length !== 0) throw createError(400, '使用者已在群組');

  return await prisma.chatroom.update({
    where: {
      id: roomId,
    },
    data: {
      members: {
        connect: userIds.map(id => ({ id })),
      },
    },
    include: {
      members: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
};

export const leaveChatroom = async ({ roomId, currentUserId, userIds }) => {
  const isMember = await checkIsMember(roomId, currentUserId);

  if (!isMember) throw createError(403, '你不是群組人員');

  const isExisting = await checkIsExisting(roomId, userIds);

  if (isExisting.length === 0) throw createError(400, '使用者不在群組');

  return await prisma.chatroom.update({
    where: {
      id: roomId,
    },
    data: {
      members: {
        disconnect: userIds.map(id => ({ id })),
      },
    },
    include: {
      members: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
};

export const deleteChatroom = async ({ roomId, currentUserId }) => {
  const isMember = await checkIsMember(roomId, currentUserId);

  if (!isMember) throw createError(403, '你不是群組人員');

  return await prisma.chatroom.delete({
    where: {
      id: roomId,
    },
  });
};
