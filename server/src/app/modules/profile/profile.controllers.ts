import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import { parentProfileSetupService } from '@/app/modules/profile/profile.services';

export const parentProfileSetupController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    await parentProfileSetupService();
    
    res.status(200).json({
      success: true,
      message: 'Parent profile setup succssful.',
      traceId
    });
    return;
  }
);
