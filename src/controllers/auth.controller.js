import z from 'zod';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import * as authService from '../services/auth.service.js';
import { generatedToken } from '../utils/token.js';

export const register = async (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success)
    return res.status(400).json(z.flattenError(result.error));

  try {
    const newUser = await authService.register(result.data);
    const token = generatedToken(newUser);

    return res
      .status(200)
      .json({ message: 'Register success.', data: newUser, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success)
    return res.status(400).json(z.flattenError(result.error));

  try {
    const user = await authService.login(result.data);

    if (!user)
      return res.status(401).json({ message: 'Invalid username or password.' });

    const token = generatedToken(user);

    return res
      .status(200)
      .json({ message: 'Login success.', data: user, token });
  } catch (err) {
    next(err);
  }
};
