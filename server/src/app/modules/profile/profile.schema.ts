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

/**
 * This schema is used to validate the update parent profile request body.
 */
export const updateParentProfileSchema = z
  .object({
    fullName: z.string().min(1).trim().optional(),
    avatarUrl: z.url().optional(),
    phone: z.string().trim().optional(),
    occupation: z.string().trim().optional(),
    address: z.string().trim().optional(),
    relationWithChild: z.string().trim().optional(),
  })
  .strict();

/**
 * This schema is used to validate the update teacher profile request body.
 */
export const updateTeacherProfileSchema = z
  .object({
    fullName: z.string().min(1).trim().optional(),
    avatarUrl: z.url().optional(),
    phone: z.string().trim().optional(),
    department: z.string().trim().optional(),
    designation: z.string().trim().optional(),
    bio: z.string().trim().optional(),
  })
  .strict();

export type TUpdateParentProfilePayload = z.infer<
  typeof updateParentProfileSchema
>;
export type TUpdateTeacherProfilePayload = z.infer<
  typeof updateTeacherProfileSchema
>;
