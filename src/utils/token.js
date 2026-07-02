import jwt from 'jsonwebtoken';

export const generatedToken = data => {
  return jwt.sign({ ...data }, process.env.SECRET, { expiresIn: '1d' });
};
