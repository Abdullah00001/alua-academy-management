import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import { comparePassword } from '@/app/utils/password.utils';

/**
 * This middleware validates the current password and ensures the new
 * password differs from the existing one. If either check fails, it
 * returns a unified 400 response that does not distinguish which
 * specific check failed.
 *
 * Assumes req.user is populated by checkUserExistenceMiddleware.
 *
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const checkCurrentPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    const { currentPassword, newPassword } = req.body;

    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message:
          'Current password is incorrect or new password matches the existing one.',
        traceId,
      });
      return;
    }

    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      res.status(400).json({
        success: false,
        message:
          'Current password is incorrect or new password matches the existing one.',
        traceId,
      });
      return;
    }

    next();
  }
);
