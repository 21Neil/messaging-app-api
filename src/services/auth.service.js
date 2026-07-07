import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';

export const register = async ({ username, password, name}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      username: username,
      name: name,
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

export const login = async ({ username, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
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
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!isPasswordValid) return false;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
  };
};
