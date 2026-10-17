import { z } from 'zod';

/**
 * Find recover user by email schema
 */
export const findRecoverUserByEmailSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

/**
 * Verify recover user otp schema
 */
export const verifyRecoverUserOtpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Otp must be 6 digits')
    .regex(/^[0-9]{6}$/, 'Otp must contain only numbers'),
});
