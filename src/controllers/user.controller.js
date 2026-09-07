import { createError } from '../utils/createError.js';
import * as userServices from '../services/user.service.js';
import { updateUserNameSchema } from '../schemas/auth.schema.js';
import * as z from 'zod';
import { generatedToken } from '../utils/token.js';

const isProduction = process.env.NODE_ENV === 'production';

export const updateUserName = async (req, res, next) => {
  const userId = +req.params.id;
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
        secure: isProduction
      })
      .json({ message: 'Change success' });
  } catch (err) {
    next(err);
  }
};
