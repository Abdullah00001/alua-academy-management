import { z } from 'zod';

/**
 * @description: This schema is for signup.
 */
export const signupSchema = z.object({
  fullName: z.string().min(1, { error: 'Full name is required' }).trim(),
  email: z
    .email({ error: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { error: 'Invalid phone number' })
    .trim(),
  role: z.enum(
    ['PARENT', 'TEACHER'],
    'error: Invalid role. Please provide a valid role'
  ),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters long' })
    .max(16, { error: 'Password must not exceed 16 characters' })
    .regex(/[A-Z]/, {
      error: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      error: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { error: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
      error: 'Password must contain at least one special character',
    })
    .trim(),
  isLegalTermAccepted: z.boolean({ error: 'Legal term must be accepted' }),
});

/**
 * @description This schema is for verify signup schema endpoint
 */
export const verifySignupSchema = z.object({
  otp: z.string().min(6, { error: 'Otp must be at least 6 characters long' }),
  deviceIdentifier: z
    .string({ error: 'Device identifier is required' })
    .min(1, { error: 'Device identifier is required' })
    .trim(),
  fcmToken: z.string().min(1).trim().optional(),
  platform: z.enum(
    ['ANDROID', 'IOS'],
    'error: Invalid platform. Please provide a valid platform'
  ),
});

/**
 * @description This schema is for check user access token endpoint
 */
export const checkAccessTokenSchema = z
  .object({
    fcmToken: z.string().optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .email({ error: 'Please provide a valid email address' })
      .toLowerCase(),
    password: z.string().min(1, { error: 'Password is required' }),
    role: z.enum(['PARENT', 'TEACHER']),
    deviceIdentifier: z
      .string({ error: 'Device identifier is required' })
      .min(1, { error: 'Device identifier is required' })
      .trim(),
    fcmToken: z.string().min(1).trim().optional(),
    platform: z.enum(['ANDROID', 'IOS']),
    rememberMe: z.boolean().default(false),
  })
  .strict();

export type TLoginPayload = z.infer<typeof loginSchema>;

