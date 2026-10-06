import { prisma } from '../../lib/prisma.js';
import { compressImg } from '../utils/compressImg.js';
import { createError } from '../utils/createError.js';
import { getFileFromR2, uploadFileToR2 } from './storage.service.js';

export const sendMessage = async ({ roomId, senderId, content }) => {
  return await prisma.messages.create({
    data: {
      content: content,
      type: 'text',
      chatroom: {
        connect: { id: roomId },
      },
      sender: {
        connect: { id: senderId },
      },
    },
  });
};

export const sendImage = async ({ roomId, senderId, image }) => {
  if (!image) throw createError(400, '未收到圖片');

  const { data: imageBuffer, info: imageInfo } = await compressImg(
    image.buffer,
  );
  const imgKey = await uploadFileToR2(
    imageBuffer,
    imageInfo.format,
    `chatrooms/${roomId}`,
  );

  return prisma.messages.create({
    data: {
      content: `${process.env.API_BASE_URL}/api/chatrooms/${roomId}/messages/images/${imgKey}`,
      type: 'image',
      chatroom: {
        connect: {
          id: roomId,
        },
      },
      sender: {
        connect: {
          id: senderId,
        },
      },
    },
  });
};

export const getImage = async ({ roomId, imgKey }) => {
  const image = await getFileFromR2(`chatrooms/${roomId}`, imgKey);

  if (!image) throw createError(400, '未找到圖片');

  return image;
};
