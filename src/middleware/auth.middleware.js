import jwt from 'jsonwebtoken';

export const authenticated = (req, res, next) => {
  const token = req.cookies.token

  if (!token)
    return res.status(401).json({ message: 'Not authorized, no token found.' });

  try {
    const decode = jwt.verify(token, process.env.SECRET);

    req.user = {
      ...decode,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed.'})
  }
};
