import { NextFunction, Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import { TFindRecoverUserByEmailPayload } from '@/app/modules/recover/recover.types';
import prisma from '@/app/configs/db.configs';
import { AuthErrorType } from '@/const';
import { User } from '@prisma/client';

/**
 * This middleware is for find the recover user
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns Promise<void>  
 */
export const findRecoverUserMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = getTraceId();
    const { email } = req.body as TFindRecoverUserByEmailPayload;
    const isUserExist = await prisma.user.findUnique({
      where: { email },
    });
    if (!isUserExist) {
      res.status(401).json({
        success: false,
        errorType: AuthErrorType.USER_NOT_FOUND,
        message:
          'User with the email is not found,Please check your email address!',
        traceId,
      }); 
      return;
    }
    req.user = isUserExist as User;
    next();
  }
);
