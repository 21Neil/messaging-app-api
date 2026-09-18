import sharp from 'sharp';
import { prisma } from '../../lib/prisma.js';
import {
  deleteFileFromR2,
  getFileFromR2,
  uploadFileToR2,
} from './storage.service.js';
import bcrypt from 'bcrypt';
import { createError } from '../utils/createError.js';

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

    if (oldAvatarKey) await deleteFileFromR2('avatars', oldAvatarKey);

    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: `${process.env.API_BASE_URL}/api/users/avatars/${imgKey}`,
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

export const updateUserPassword = async ({ userId, password, newPassword }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const isPasswordValid = user
    ? await bcrypt.compare(password, user.password)
    : false;
  const isPasswordSame = user ? await bcrypt.compare(newPassword, user.password) : false;

  if (!isPasswordValid) throw createError(401, '密碼錯誤', 'INVALID_CREDENTIALS');
  if (isPasswordSame) throw createError(400, '新密碼不得與舊密碼相同')

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};
