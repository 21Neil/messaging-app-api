import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';

export const register = async data => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: {
      username: data.username,
      name: data.name,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
  });
};

export const login = async data => {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
    select: {
      id: true,
      username: true,
      password: true,
      name: true,
      avatar: true,
    },
  });

  const isPasswordValid = user
    ? await bcrypt.compare(data.password, user.password)
    : false;

  if (!isPasswordValid) return false;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
  };
};
