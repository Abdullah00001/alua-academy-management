import { z } from 'zod';

/**
 * Schema for change password endpoint.
 * Complexity rules match signup rules — password strength is enforced
 * when SETTING a new password, not when verifying an existing one.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: 'Current password is required' }),
    newPassword: z
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
  })
  .strict();

export type TChangePasswordPayload = z.infer<typeof changePasswordSchema>;
