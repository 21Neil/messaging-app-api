import { FriendshipStatus } from '../../generated/prisma/index.js';
import { prisma } from '../../lib/prisma.js';
import { createError } from '../utils/createError.js';

export const getFriendshipInvitations = async ({ receiverId }) => {
  return await prisma.friendships.findMany({
    where: {
      receiverId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createAt: 'desc',
    },
  });
};

export const sentFriendship = async ({ senderId, receiverUsername }) => {
  const receiver = await prisma.user.findUnique({
    where: {
      username: receiverUsername,
    },
  });

  if (!receiver) throw createError(404, '找不到使用者');
  if (senderId === receiver.id) throw createError(400, '不能加自己為好友');

  const existingRelationship = await prisma.friendships.findFirst({
    where: {
      OR: [
        { senderId, receiverId: receiver.id },
        { senderId: receiver.id, receiverId: senderId },
      ],
    },
  });

  if (existingRelationship) {
    if (existingRelationship.status === FriendshipStatus.ACCEPTED)
      throw createError(400, '你們已為好友');
    if (existingRelationship.status === FriendshipStatus.PENDING)
      throw createError(400, '已有待處理的邀請');
  }

  return await prisma.friendships.create({
    data: {
      sender: {
        connect: {
          id: senderId,
        },
      },
      receiver: {
        connect: {
          username: receiverUsername,
        },
      },
    },
  });
};

export const applyFriendship = async ({ friendshipId, receiverId }) => {
  const friendship = await prisma.friendships.findUnique({
    where: {
      id: friendshipId,
    },
  });

  if (!friendship) 
    throw createError(404, '找不到此請求');
  if (friendship.status !== FriendshipStatus.PENDING)
    throw createError(400, '此請求已處理');
  if (friendship.receiverId !== receiverId)
    throw createError(403, '你沒有權限處理此請求');

  return await prisma.friendships.update({
    where: {
      id: friendshipId,
      receiverId: receiverId,
    },
    data: {
      status: FriendshipStatus.ACCEPTED,
    },
  });
};
