export const createError = (status, message, code) => {
  const err = new Error(message);

  err.statusCode = status;
  if (code) err.code = code;

  return err;
};
