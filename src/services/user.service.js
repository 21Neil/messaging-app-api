import sharp from 'sharp';
import { prisma } from '../../lib/prisma.js';
import { uploadFileToR2 } from './storage.service.js';

const compressImg = async img => {
  return await sharp(img)
    .resize(100, 100, { withoutEnlargement: true })
    .toFormat('webp', { quality: 85, effort: 4, smartSubsample: true })
    .toBuffer();
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

export const updateUserAvatar = async ({ userId, avatar }) => {
  const compressedImgBuffer = await compressImg(avatar.buffer);
  const imgKey = await uploadFileToR2(
    avatar.originalname,
    compressedImgBuffer,
    avatar.mimetype,
    'avatars',
  );

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatar: `${process.env.API_BASE_URl}/api/users/${userId}/avatars/${imgKey}`,
    },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
  });
};
