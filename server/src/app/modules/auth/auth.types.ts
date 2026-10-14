import { z } from 'zod';
import { User } from '@prisma/client';
import {
  signupSchema,
  verifySignupSchema,
  checkAccessTokenSchema,
  TLoginPayload,
} from '@/app/modules/auth/auth.schema';

export type TSignupPayload = z.infer<typeof signupSchema>;

export type TVerifySignUserOtpPayload = z.infer<typeof verifySignupSchema>;

export type TCheckAccessTokenPayload = z.infer<typeof checkAccessTokenSchema>;

export type { TLoginPayload };

export interface ILoginServiceParams {
  user: User;
  payload: TLoginPayload;
}

