const isProduction = process.env.NODE_ENV === 'production';

export const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
};
