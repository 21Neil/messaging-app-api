import { createError } from '../utils/createError.js';
import * as userServices from '../services/user.service.js';
import { updateUserNameSchema } from '../schemas/auth.schema.js';
import * as z from 'zod';
import { generatedToken } from '../utils/token.js';
import { DEFAULT_COOKIE_OPTIONS } from '../utils/cookies.js';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const updateUserName = async (req, res, next) => {
  const userId = +req.user.id;
  const result = await updateUserNameSchema.safeParse(req.body);

  if (!result.success)
    return res.status(400).json(z.flattenError(result.error));

  try {
    const user = await userServices.updateUserName({ userId, ...result.data });
    const token = generatedToken(user);

    return res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
      })
      .json({ message: 'Change success' });
  } catch (err) {
    next(err);
  }
};

export const updateUserAvatar = async (req, res, next) => {
  const userId = +req.user.id;
  const avatar = req.file;
  const oldAvatarUrl = new URL(req.body.oldAvatarUrl);
  const oldAvatarKey = path.basename(oldAvatarUrl.pathname);

  try {
    const user = await userServices.updateUserAvatar({
      userId,
      avatar,
      oldAvatarKey,
    });
    const token = generatedToken(user);

    return res
      .status(200)
      .cookie('token', token, DEFAULT_COOKIE_OPTIONS)
      .json({ message: 'Change success' });
  } catch (err) {
    next(err);
  }
};

export const getUserAvatar = async (req, res, next) => {
  const imgKey = req.params.key;

  try {
    const avatar = await userServices.getUserAvatar({ imgKey });

    if (!avatar) return res.status(404).json({ message: '未找到圖片' });

    return avatar.Body.pipe(res);
  } catch (err) {
    next(err);
  }
};

export const updateUserPassword = async (req, res, next) => {
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  const userId = +req.user.id;

  try {
    const result = await userServices.updateUserPassword({
      userId,
      password,
      newPassword,
    });

    if (!result)
      res
        .status(401)
        .json({ code: 'INVALID_CREDENTIALS', message: '密碼錯誤' });

    return res
      .status(200)
      .clearCookie('token')
      .json({ message: '修改成功，請新登入' });
  } catch (err) {
    next(err);
  }
};
