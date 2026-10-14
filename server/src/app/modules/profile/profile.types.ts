import { z } from 'zod';
import { setUpParentProfileSchema } from '@/app/modules/profile/profile.schema';

export type TSetupParentProfilePayload = z.infer<
  typeof setUpParentProfileSchema
>;
