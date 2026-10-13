import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import { signupService } from '@/app/modules/auth/auth.services';
import { TSignupPayload } from '@/app/modules/auth/auth.types';

export const signupController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const payload = req.body as TSignupPayload;
    const data = await signupService({ payload, traceId });

    res.status(201).json({
      success: true,
      message:
        'Signup successful,Please check you email for otp to verify your account!',
      data,
      traceId,
    });
    return;
  }
);
