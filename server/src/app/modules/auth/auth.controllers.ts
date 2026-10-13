import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import {
  signupService,
  verifySignupUserService,
} from '@/app/modules/auth/auth.services';
import {
  TSignupPayload,
  TVerifySignUserOtpPayload,
} from '@/app/modules/auth/auth.types';
import { User } from '@prisma/client';
import { extractToken } from '@/app/utils/jwt.utils';

/**
 * This controller is for signup.
 * @param req
 * @param res
 * @returns void
 */
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

/**
 * This controller is for verify signup user.
 * @param req
 * @param res
 * @returns void
 */
export const verifySignupUserController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const token = extractToken(req) as string;
    const payload = req.body as TVerifySignUserOtpPayload;
    const user = req.user as User;
    const data = await verifySignupUserService({
      payload,
      traceId,
      user,
      token,
    });

    res.status(200).json({
      success: true,
      message: 'User verification successful',
      data,
      traceId,
    });
    return;
  }
);
