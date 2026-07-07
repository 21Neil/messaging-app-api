import jwt from 'jsonwebtoken';

export const authenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized, no token found.' });

  try {
    const token = authHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.SECRET);

    req.user = {
      ...decode,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed.'})
  }
};
