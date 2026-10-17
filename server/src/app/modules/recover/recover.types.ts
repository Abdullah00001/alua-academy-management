import { z } from 'zod';
import { findRecoverUserByEmailSchema } from '@/app/modules/recover/recover.schema';
import { User } from '@prisma/client';

export type TFindRecoverUserByEmailPayload = z.infer<
  typeof findRecoverUserByEmailSchema
>;

export type TFindRecoverUserByEmailServiceParams = {
  user: User;
  traceId: string;
};

export type TResendRecoverUserOtpServiceParams = {
  user: User;
  traceId: string;
};

export type TVerifyRecoverUserOtpServiceParams = {
  user: User;
};
