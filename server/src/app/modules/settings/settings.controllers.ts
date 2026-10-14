import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import { changePasswordService } from '@/app/modules/settings/settings.services';
import { TChangePasswordPayload } from '@/app/modules/settings/settings.schema';
import { Device, User } from '@prisma/client';

/**
 * This controller handles the change password request.
 * Validation and current-password checks are handled by middleware
 * upstream. This controller only invokes the service and returns the
 * success response.
 *
 * @param req Request
 * @param res Response
 * @returns void
 */
export const changePasswordController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    const device = req.device as Device;
    const payload = req.body as TChangePasswordPayload;

    await changePasswordService({
      user,
      deviceId: device.id,
      payload,
    });

    res.status(200).json({
      success: true,
      message: 'Change password successful.',
      traceId,
    });
    return;
  }
);
