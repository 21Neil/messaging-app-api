import { prisma } from '../../lib/prisma.js';
import { createError } from '../utils/createError.js';

const checkHaveUsers = async usernames => {
  const users = await prisma.user.findMany({
    where: {
      username: {
        in: usernames.map(username => username),
      },
    },
    select: {
      name: true,
    },
  });

  return users.length === usernames.length;
};

const checkIsExisting = async (roomId, usernames) => {
  const users = await prisma.user.findMany({
    where: {
      username: {
        in: usernames.map(username => username),
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

  return users.length > 0;
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
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          lastMessageAt: 'desc',
        },
      },
    },
  });
};

export const createChatroom = async ({ name, members }) => {
  const isHaveUsers = await checkHaveUsers(members.map(username => username));

  if (!isHaveUsers) throw createError(400, '未找到使用者');

  return await prisma.chatroom.create({
    data: {
      name: name ?? null,
      members: {
        connect: members.map(username => ({
          username,
        })),
      },
    },
  });
};

export const updateChatroomName = async ({ id, name }) => {
  return await prisma.chatroom.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

export const updateChatroomLastMessageAt = async ({ id, lastMessageAt }) => {
  return await prisma.chatroom.update({
    where: {
      id,
    },
    data: {
      lastMessageAt,
    },
  });
};

export const joinChatroom = async ({ roomId, usernames }) => {
  const isExisting = await checkIsExisting(roomId, usernames);
  const isHaveUsers = await checkHaveUsers(usernames);

  if (isExisting) throw createError(400, '使用者已在群組');
  if (!isHaveUsers) throw createError(400, '未找到使用者');

  return await prisma.chatroom.update({
    where: {
      id: roomId,
    },
    data: {
      members: {
        connect: usernames.map(username => ({ username })),
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

export const leaveChatroom = async ({ roomId, username }) => {
  const isExisting = await checkIsExisting(roomId, [username]);

  if (!isExisting) throw createError(400, '使用者不在群組中');

  return await prisma.chatroom.update({
    where: {
      id: roomId,
    },
    data: {
      members: {
        disconnect: { username: username },
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

export const deleteChatroom = async ({ roomId }) => {
  return await prisma.chatroom.delete({
    where: {
      id: roomId,
    },
  });
};

export const getChatroom = async ({ roomId }) => {
  return await prisma.chatroom.findUnique({
    where: {
      id: roomId,
    },
    include: {
      members: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      messages: {
        take: 50,
        orderBy: {
          createAt: 'asc',
        },
        include: {
          sender: {
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
