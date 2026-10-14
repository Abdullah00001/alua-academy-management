import { z } from 'zod';
import { Device, User } from '@prisma/client';
import {
  signupSchema,
  verifySignupSchema,
  checkAccessTokenSchema,
  TLoginPayload,
} from '@/app/modules/auth/auth.schema';
import { ITokenPayload } from '@/app/@types/jwt.types';

export type TSignupPayload = z.infer<typeof signupSchema>;

export type TVerifySignUserOtpPayload = z.infer<typeof verifySignupSchema>;

export type TCheckAccessTokenPayload = z.infer<typeof checkAccessTokenSchema>;

export type { TLoginPayload };

export interface ILoginServiceParams {
  user: User;
  payload: TLoginPayload;
}

export interface ILogoutServiceParams {
  device: Device;
  jwtPayload: ITokenPayload;
  token: string;
}

