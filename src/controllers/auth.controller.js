import z from 'zod';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import * as authService from '../services/auth.service.js';
import { generatedToken } from '../utils/token.js';

const isProduction = process.env.NODE_ENV === 'production';

export const register = async (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success)
    return res.status(400).json(z.flattenError(result.error));

  try {
    const newUser = await authService.register(result.data);
    const token = generatedToken(newUser);

    return res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        samesite: isProduction ? 'none' : 'lax',
        secure: isProduction,
      })
      .json({ message: 'Register success.', data: newUser });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  console.log(result)

  if (!result.success)
    return res.status(400).json(z.flattenError(result.error));

  try {
    const user = await authService.login(result.data);
    console.log(user)

    if (!user)
      return res.status(401).json({ message: 'Invalid username or password.' });

    const token = generatedToken(user);
    console.log('first')

    return res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        samesite: isProduction ? 'none' : 'lax',
        secure: isProduction,
      })
      .json({ message: 'Login success.', data: user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie('token')
      .json({ message: 'Logout success' });
  } catch (err) {
    next(err);
  }
};
