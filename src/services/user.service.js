import sharp from 'sharp';
import { prisma } from '../../lib/prisma.js';
import { deleteFileFromR2, getFileFromR2, uploadFileToR2 } from './storage.service.js';

const compressImg = img => {
  return sharp(img)
    .resize(100, 100, { withoutEnlargement: true })
    .toFormat('webp', { quality: 85, effort: 4, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });
};

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

export const updateUserAvatar = async ({ userId, avatar, oldAvatarKey }) => {
  if (avatar) {
    const { data: avatarBuffer, info: avatarInfo } = await compressImg(
      avatar.buffer,
    );
    const imgKey = await uploadFileToR2(
      avatarBuffer,
      avatarInfo.format,
      'avatars',
    );

    if (oldAvatarKey) await deleteFileFromR2('avatars', oldAvatarKey)

    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: `${process.env.API_BASE_URL}/api/users/${userId}/avatars/${imgKey}`,
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
      },
    });
  }

  if (!avatar) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: null,
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
      },
    });
  }
};

export const getUserAvatar = async ({ imgKey }) => {
  return await getFileFromR2('avatars', imgKey);
};
