import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import {
  parentProfileSetupService,
  teacherProfileSetupService,
} from '@/app/modules/profile/profile.services';
import {
  TSetupParentProfilePayload,
  TSetupTeacherProfilePayload,
} from '@/app/modules/profile/profile.types';
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
    const data = await parentProfileSetupService({ payload, user });

    res.status(200).json({
      success: true,
      message: 'Parent profile setup successful.',
      data,
      traceId,
    });
    return;
  }
);

/**
 * This controller will handle the teacher profile setup request.
 * It will call the teacherProfileSetupService to setup the teacher profile.
 *
 * @param req - {Object} Request object
 * @param res - {Object} Response object
 * @returns {Promise<void>}
 */
export const teacherProfileSetupController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    const payload = req.body as TSetupTeacherProfilePayload;
    const data = await teacherProfileSetupService({ payload, user });

    res.status(200).json({
      success: true,
      message: 'Teacher profile setup successful.',
      data,
      traceId,
    });
    return;
  }
);
