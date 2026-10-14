import { z } from 'zod';
import {
  setUpParentProfileSchema,
  setUpTeacherProfileSchema,
} from '@/app/modules/profile/profile.schema';

export type TSetupParentProfilePayload = z.infer<
  typeof setUpParentProfileSchema
>;

export type TSetupTeacherProfilePayload = z.infer<
  typeof setUpTeacherProfileSchema
>;
