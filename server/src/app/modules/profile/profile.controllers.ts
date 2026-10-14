import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import { parentProfileSetupService } from '@/app/modules/profile/profile.services';
import { TSetupParentProfilePayload } from '@/app/modules/profile/profile.types';
import { User } from '@prisma/client';

/**
 * This controller will handle the parent profile setup request.
 * It will call the parentProfileSetupService to setup the parent profile.
 * 
 * @param req - {Object} Request object
 * @param res - {Object} Response object
 * @returns {Promise<void>}
 */
export const parentProfileSetupController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    const payload = req.body as TSetupParentProfilePayload;
    const data = await parentProfileSetupService({ payload,user });

    res.status(200).json({
      success: true,
      message: 'Parent profile setup successful.',
      data,
      traceId,
    });
    return;
  }
);
