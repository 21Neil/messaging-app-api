import { prisma } from '../../lib/prisma.js';

export const updateUserName = async ({ userId, name }) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
  });
};
