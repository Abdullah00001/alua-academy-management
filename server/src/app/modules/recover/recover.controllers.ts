import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import {
  findRecoverUserService,
  resendRecoverUserOtpService,
  verifyRecoverUserOtpService,
  resetRecoverUserPasswordService,
} from '@/app/modules/recover/recover.services';
import { User } from '@prisma/client';
import { TResetRecoverUserPasswordPayload } from './recover.types';
import { extractToken } from '@/app/utils/jwt.utils';

/**
 * This controller is used to find the user for the password reset.
 * @param req Request
 * @param res Response
 * @returns Promise<void>  
 */
export const findRecoverUserController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    const data = await findRecoverUserService({ traceId, user });

    res.status(200).json({
      success: true,
      message: 'Recover user found and otp send to user email.',
      data,
      traceId,
    });
    return;
  }
);

/**
 * This controller is used to resend the otp to the user.
 * @param req Request
 * @param res Response
 * @returns Promise<void>  
 */
export const resendRecoverUserOtpController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    await resendRecoverUserOtpService({ traceId, user });
    res.status(200).json({
      success: true,
      message: 'Recover user otp resend successful!',
      traceId,
    });
    return;
  }
);

/**
 * This controller is used to verify the otp of the user.
 * @param req Request
 * @param res Response
 * @returns Promise<void>
 */
export const verifyRecoverUserOtpController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    await verifyRecoverUserOtpService({ user });
    res.status(200).json({
      success: true,
      message: 'Recover user otp verfication successful!',
      traceId,
    });
    return;
  }
);

/**
 * This controller is used to reset the password of the user.
 * @param req Request
 * @param res Response
 * @returns Promise<void>
 */
export const resetRecoverUserPasswordController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const { password } = req.body as TResetRecoverUserPasswordPayload;
    const user = req.user as User;
    const token = extractToken(req) as string;
    await resetRecoverUserPasswordService({ password, traceId, user, token });
    res.status(200).json({
      success: true,
      message: 'Recover user password reset successful!',
      traceId,
    });
    return;
  }
);
