import { z } from 'zod';

/**
 * This schema will be used for validate the request body of parent profile setup.
 */
export const setUpParentProfileSchema = z.object({
  avatarUrl: z.url().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  relationWithChild: z.string().optional(),
});

/**
 * This schema will be used for validate the request body of teacher profile setup.
 */
export const setUpTeacherProfileSchema = z.object({
  avatarUrl: z.url().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  bio: z.string().optional(),
});
