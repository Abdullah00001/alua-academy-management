import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import { findRecoverUserService, resendRecoverUserOtpService } from '@/app/modules/recover/recover.services';
import { User } from '@prisma/client';

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

export const resendRecoverUserOtpController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    await resendRecoverUserOtpService();
    
    res.status(200).json({
      success: true,
      message: 'Recover user otp resend successful!',
      traceId
    });
    return;
  }
);
