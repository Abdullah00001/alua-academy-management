import { Request, Response } from 'express';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import {
  signupService,
  verifySignupUserService,
  resendVerifySignupOtpService,
  checkUserAccessTokenService,
  loginService,
  logoutService,
  adminLoginService,
  checkAdminAccessTokenService,
  refreshAdminAccessTokenService,
} from '@/app/modules/auth/auth.services';
import {
  TCheckAccessTokenPayload,
  TLoginPayload,
  TSignupPayload,
  TVerifySignUserOtpPayload,
} from '@/app/modules/auth/auth.types';
import { Device, User } from '@prisma/client';
import { extractToken } from '@/app/utils/jwt.utils';
import { ITokenPayload } from '@/app/@types/jwt.types';

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

/**
 * This controller is for resend verify signup user otp.
 * @param req
 * @param res
 * @returns void
 */
export const resendVerifySignupOtpController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    await resendVerifySignupOtpService({ user, traceId });

    res.status(200).json({
      success: true,
      message: 'Signup verification otp resend successful!',
      traceId,
    });
    return;
  }
);

/**
 * This controller function will handle the check user access token request.
 * @param req
 * @param res
 * @returns void
 */
export const checkUserAccessTokenController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    const device = req.device as Device;
    const payload = req.body as TCheckAccessTokenPayload;

    const data = await checkUserAccessTokenService({ user, device, payload });

    res.status(200).json({
      success: true,
      message: 'User is authenticated.',
      data,
      traceId,
    });
    return;
  }
);

/**
 * This controller function will handle the login request.
 * @param req
 * @param res
 * @returns void
 */
export const loginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as User;
    const payload = req.body as TLoginPayload;

    const data = await loginService({ user, payload });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data,
      traceId,
    });
    return;
  }
);

/**
 * This controller function will handle the logout request.
 * @param req
 * @param res
 * @returns void
 */
export const logoutController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    const device = req.device as Device;
    const jwtPayload = req.jwtPayload as ITokenPayload;
    const token = extractToken(req) as string;

    await logoutService({ device, jwtPayload, token });

    res.status(200).json({
      success: true,
      message: 'Logout successful.',
      traceId,
    });
    return;
  }
);

export const adminLoginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    await adminLoginService();

    res.status(200).json({
      success: true,
      message: 'Admin login successful!',
      traceId,
    });
    return;
  }
);

export const checkAdminAccessTokenController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    await checkAdminAccessTokenService();

    res.status(200).json({
      success: true,
      message: 'Admin is authenticated!',
      traceId,
    });
    return;
  }
);

export const refreshAdminAccessTokenController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const traceId = getTraceId();
    await refreshAdminAccessTokenService();

    res.status(200).json({
      success: true,
      message: 'Token refresh successful!',
      traceId,
    });
    return;
  }
);
