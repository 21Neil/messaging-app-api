import z from 'zod';

const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(30)
  .regex(/^[A-Za-z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  });
const passwordSchema = z.string().min(8).max(100);
const nameSchema = z.string().trim().min(1).max(50);

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const getRoomParamsSchema = z.object({
  id: z.coerce.number()
})
