import { z } from 'zod';
import {
  signupSchema,
  verifySignupSchema,
} from '@/app/modules/auth/auth.schema';

export type TSignupPayload = z.infer<typeof signupSchema>;

export type TVerifySignUserOtpPayload = z.infer<typeof verifySignupSchema>;
