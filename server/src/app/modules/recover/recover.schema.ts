import { z } from 'zod';

/** 
 * Find recover user by email schema
 */
export const findRecoverUserByEmailSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

