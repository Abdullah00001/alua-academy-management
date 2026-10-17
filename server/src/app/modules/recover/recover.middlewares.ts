import { NextFunction, Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler, createRedisKey } from '@/app/utils/system.utils';
import { TFindRecoverUserByEmailPayload } from '@/app/modules/recover/recover.types';
import prisma from '@/app/configs/db.configs';
import { AuthErrorType, COOKIE_NAMES, REDIS_PREFIXES } from '@/const';
import { User } from '@prisma/client';
import {
  extractToken,
  verifyResetPasswordPageToken,
} from '@/app/utils/jwt.utils';
import { getRedisClient } from '@/app/configs/redis.configs';
import { JwtPayload } from 'jsonwebtoken';

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

/**
 * This middleware is used to verify the reset password page token.
 * It checks if the token is blacklisted and if the token is expired.
 * If the token is valid, it sets the user in the request.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns {Promise<void>}
 */
export const checkResetPasswordPageTokenMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const traceId = getTraceId();
    const token =
      req.cookies[COOKIE_NAMES.RECOVER_PAGE_TOKEN] || extractToken(req);
    req.headers['x-recover-token'] = token as string;
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token not found',
        errorType: AuthErrorType.TOKEN_INVALID,
        traceId,
      });
      return;
    }
    const redisClient = getRedisClient();
    const isBlackListed = await redisClient.get(
      createRedisKey(REDIS_PREFIXES.blacklist, token)
    );
    if (isBlackListed) {
      res.status(401).json({
        success: false,
        message: 'Token has been revoked',
        errorType: AuthErrorType.TOKEN_BLACKLISTED,
        traceId,
      });
      return;
    }
    const decoded = verifyResetPasswordPageToken(token);
    if (decoded.error) {
      if (decoded.error === AuthErrorType.TOKEN_EXPIRED) {
        res.status(401).json({
          success: false,
          message: 'Token has been expired',
          errorType: AuthErrorType.TOKEN_EXPIRED,
          traceId,
        });
        return;
      }
      res.status(401).json({
        success: false,
        message: 'Token is invalid',
        errorType: AuthErrorType.TOKEN_INVALID,
        traceId,
      });
      return;
    }
    req.user = decoded.data as JwtPayload;
    return next();
  }
);
