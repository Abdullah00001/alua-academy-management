// Types specific to the email queue can be defined here
// export interface IEmailJobData { ... }

import { Role } from '@prisma/client';

export interface IAccountCreateSuccess {
  // Add properties here
  otp: string;
  otpExpireAt: number;
  name: string;
  email: string;
  traceId: string;
}

export interface ISendSignupSuccessEmail {
  // Add properties here
  name: string;
  email: string;
  traceId: string;
  role: Role;
}

export interface IResendVerificationOtp {
  // Add properties here
  otp: string;
  otpExpireAt: number;
  name: string;
  email: string;
  traceId: string;
}

export interface ISendRecoverUserOtp {
  // Add properties here
  otp: string;
  otpExpireAt: number;
  name: string;
  email: string;
  traceId: string;
}

export interface IResetRecoverUserPasswordSuccessful {
  // Add properties here
  name: string;
  email: string;
  traceId: string;
}
