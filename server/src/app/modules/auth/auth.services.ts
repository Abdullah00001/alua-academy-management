import prisma from '@/app/configs/db.configs';
import { getRedisClient } from '@/app/configs/redis.configs';
import {
  ILoginServiceParams,
  ILogoutServiceParams,
  TCheckAccessTokenPayload,
  TSignupPayload,
  TVerifySignUserOtpPayload,
} from '@/app/modules/auth/auth.types';
import { getEmailQueue } from '@/app/queues/email/email.queue';
import {
  generateAccessTokenForUser,
  generateOtpPageToken,
  verifyOtpPageToken,
} from '@/app/utils/jwt.utils';
import { hashOtp } from '@/app/utils/otp.utils';
import { hashPassword } from '@/app/utils/password.utils';
import {
  calculateMilliseconds,
  createRedisKey,
  generate,
  sessionTimeCalculation,
} from '@/app/utils/system.utils';
import {
  otpExpireAt,
  QUEUE_JOBS,
  REDIS_PREFIXES,
  userAccessTokenExpiresIn,
} from '@/const';
import {
  LoginDTO,
  SignupDTO,
  VerifySignupUserDTO,
} from '@/app/modules/auth/auth.dto';
import {
  Device,
  DeviceStatus,
  Platform,
  RevokeReason,
  Role,
  User,
  UserStatus,
} from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { SessionDTO } from '@/app/modules/profile/profile.dto';

/**
 * This service is for create signup user
 * @param param0 { payload: TSignupPayload }
 * @returns Promise<void>
 */
export const signupService = async ({
  payload,
  traceId,
}: {
  payload: TSignupPayload;
  traceId: string;
}): Promise<SignupDTO> => {
  try {
    const redisClient = getRedisClient();
    const emailQueue = getEmailQueue();
    const { fullName, email, password, phone, isLegalTermAccepted, role } =
      payload;

    const hashedPass = await hashPassword(password);
    const otp = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    const hashedOtp = hashOtp({ otp });
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName,
          email,
          password: hashedPass,
          phone,
          isLegalTermAccepted,
          role,
        },
      });
      if (role === Role.PARENT) {
        await tx.parent.create({
          data: {
            userId: user.id,
          },
        });
      } else if (role === Role.TEACHER) {
        await tx.teacher.create({
          data: {
            userId: user.id,
          },
        });
      }
      return user;
    });
    const token = generateOtpPageToken({
      accountStatus: user.status,
      role: user.role,
      sub: user.id,
      deviceId: 'pending',
    });
    const emailQueueData = {
      name: user.fullName,
      email: user.email,
      otp,
      otpExpireAt,
      traceId,
    };
    await Promise.all([
      redisClient.set(
        createRedisKey(REDIS_PREFIXES.otp, user.id),
        hashedOtp,
        'EX',
        calculateMilliseconds(otpExpireAt, 'minutes')
      ),
      emailQueue.add(QUEUE_JOBS.ACCOUNT_CREATE_SUCCESS, emailQueueData),
    ]);
    return new SignupDTO(token);
  } catch (error) {
    throw error;
  }
};

/**
 * This service is for verify signup user
 * @param param0 { payload: TVerifySignUserOtpPayload }
 * @returns Promise<void>
 */
export const verifySignupUserService = async ({
  payload,
  traceId,
  user,
  token,
}: {
  payload: TVerifySignUserOtpPayload;
  traceId: string;
  user: User;
  token: string;
}): Promise<VerifySignupUserDTO> => {
  try {
    const redisClient = getRedisClient();
    const emailQueue = getEmailQueue();
    const { deviceIdentifier, fcmToken, platform } = payload;
    const sessionExpiresAt = sessionTimeCalculation(userAccessTokenExpiresIn);
    const { updatedUser, device } = await prisma.$transaction(async (tx) => {
      // 1. Revoke any ACTIVE session with the same deviceIdentifier (different user)
      await tx.device.updateMany({
        where: {
          deviceIdentifier,
          status: DeviceStatus.ACTIVE,
        },
        data: {
          status: DeviceStatus.REVOKED,
          revokeReason: RevokeReason.NEW_LOGIN_SUPERSEDED,
          fcmToken: null,
        },
      });

      // 2. Revoke any ACTIVE session with the same fcmToken (different deviceIdentifier)
      if (fcmToken) {
        await tx.device.updateMany({
          where: {
            fcmToken,
            deviceIdentifier: { not: deviceIdentifier },
            status: DeviceStatus.ACTIVE,
          },
          data: {
            status: DeviceStatus.REVOKED,
            revokeReason: RevokeReason.FCM_SUPERSEDED,
            fcmToken: null,
          },
        });
      }

      // 3. Update user — mark verified + profile completed
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          status: UserStatus.ACTIVE,
          emailVerifiedAt: user.email ? new Date() : undefined,
          phoneVerifiedAt: user.phone ? new Date() : undefined,
          lastLoginAt: new Date(),
        },
      });

      // 4. Create new device session
      const device = await tx.device.create({
        data: {
          userId: user.id,
          deviceIdentifier,
          fcmToken: fcmToken ?? null,
          platform: platform as Platform,
          status: DeviceStatus.ACTIVE,
          sessionExpiresAt,
        },
      });

      return { updatedUser, device };
    });

    const accessToken = generateAccessTokenForUser({
      role: updatedUser.role,
      sub: updatedUser.id,
      deviceId: device.id,
      accountStatus: updatedUser.status,
      rememberMe: true,
    });

    const decoded = verifyOtpPageToken(token) as JwtPayload;
    const tokenExpirationTime = decoded.exp as number;
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const ttl = Math.floor(tokenExpirationTime - currentTime); // remaining time in seconds
    if (ttl > 0)
      await redisClient.set(
        createRedisKey(REDIS_PREFIXES.blacklist, token),
        token as string,
        'EX',
        ttl
      );
    const emailData = {
      name: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      traceId,
    };

    await Promise.all([
      emailQueue.add(QUEUE_JOBS.ACCOUNT_CREATE_SUCCESS, emailData),
      redisClient.del(createRedisKey(REDIS_PREFIXES.otp, updatedUser.id)),
    ]);
    return new VerifySignupUserDTO(
      accessToken,
      updatedUser.isProfileSetup,
      updatedUser.role,
      updatedUser.status,
      updatedUser.fullName,
      updatedUser.id,
      updatedUser.avatarUrl
    );
  } catch (error) {
    throw error;
  }
};

/**
 * This service is for resend verify signup user otp.
 * @param param0 { user, traceId }
 * @returns Promise<void>
 */
export const resendVerifySignupOtpService = async ({
  user,
  traceId,
}: {
  user: User;
  traceId: string;
}): Promise<void> => {
  try {
    const redisClient = getRedisClient();
    const emailQueue = getEmailQueue();
    const otp = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    const hashedOtp = hashOtp({ otp });
    const emailData = {
      name: user.fullName,
      email: user.email,
      otp,
      otpExpireAt,
      traceId,
    };
    await Promise.all([
      redisClient.del(createRedisKey(REDIS_PREFIXES.otp, user.id)),
      redisClient.set(
        createRedisKey(REDIS_PREFIXES.otp, user.id),
        hashedOtp,
        'EX',
        calculateMilliseconds(otpExpireAt, 'minutes')
      ),
      emailQueue.add(QUEUE_JOBS.RESEND_VERIFICATION_OTP, emailData),
    ]);
    return;
  } catch (error) {
    throw error;
  }
};

/**
 * This service is used to check the user's access token state.
 * It refreshes the device's lastSeenAt (throttled to once per hour)
 * and rotates the FCM token if the client sent a new one.
 * @param param0 { user, device, payload }
 * @returns Promise<SessionDTO>
 */
export const checkUserAccessTokenService = async ({
  user,
  device,
  payload,
}: {
  user: User;
  device: Device;
  payload: TCheckAccessTokenPayload;
}): Promise<SessionDTO> => {
  try {
    const { fcmToken } = payload;
    const LAST_SEEN_THROTTLE_MS = 60 * 60 * 1000;
    const shouldUpdateLastSeenAt =
      Date.now() - device.lastSeenAt.getTime() > LAST_SEEN_THROTTLE_MS;
    const shouldUpdateFcmToken = !!fcmToken && fcmToken !== device.fcmToken;

    if (shouldUpdateLastSeenAt || shouldUpdateFcmToken) {
      await prisma.device.update({
        where: { id: device.id },
        data: {
          lastSeenAt: shouldUpdateLastSeenAt ? new Date() : undefined,
          fcmToken: shouldUpdateFcmToken ? fcmToken : undefined,
        },
      });
    }

    return SessionDTO.buildSession(user);
  } catch (error) {
    throw error;
  }
};

/**
 * This service is used to login user.
 * @param param0 { user, payload }
 * @returns Promise<LoginDTO>
 */
export const loginService = async ({
  user,
  payload,
}: ILoginServiceParams): Promise<LoginDTO> => {
  try {
    const { deviceIdentifier, fcmToken, platform, rememberMe } = payload;
    const sessionDuration = rememberMe ? '30d' : '7d';
    const sessionExpiresAt = sessionTimeCalculation(sessionDuration);

    const { updatedUser, device } = await prisma.$transaction(async (tx) => {
      // 1. Revoke any ACTIVE session with the same deviceIdentifier
      await tx.device.updateMany({
        where: {
          deviceIdentifier,
          status: DeviceStatus.ACTIVE,
        },
        data: {
          status: DeviceStatus.REVOKED,
          revokeReason: RevokeReason.NEW_LOGIN_SUPERSEDED,
          fcmToken: null,
        },
      });

      // 2. Revoke any ACTIVE session with the same fcmToken (different deviceIdentifier)
      if (fcmToken) {
        await tx.device.updateMany({
          where: {
            fcmToken,
            deviceIdentifier: { not: deviceIdentifier },
            status: DeviceStatus.ACTIVE,
          },
          data: {
            status: DeviceStatus.REVOKED,
            revokeReason: RevokeReason.FCM_SUPERSEDED,
            fcmToken: null,
          },
        });
      }

      // 3. Update user lastLoginAt
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
        },
      });

      // 4. Create new device session
      const device = await tx.device.create({
        data: {
          userId: user.id,
          deviceIdentifier,
          fcmToken: fcmToken ?? null,
          platform: platform as Platform,
          status: DeviceStatus.ACTIVE,
          sessionExpiresAt,
        },
        select: {
          id: true,
        },
      });

      return { updatedUser, device };
    });

    const token = generateAccessTokenForUser({
      sub: updatedUser.id,
      deviceId: device.id,
      role: updatedUser.role,
      accountStatus: updatedUser.status,
      rememberMe,
    });

    return LoginDTO.buildLogin(token, SessionDTO.buildSession(updatedUser));
  } catch (error) {
    throw error;
  }
};


/**
 * This service is used to logout a device session and blacklist the access token.
 * @param param0 { device, jwtPayload, token }
 * @returns Promise<void>
 */
export const logoutService = async ({
  device,
  jwtPayload,
  token,
}: ILogoutServiceParams): Promise<void> => {
  try {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const tokenExp = jwtPayload.exp ?? 0;
    const ttl = tokenExp - currentTimeInSeconds;

    await prisma.device.update({
      where: { id: device.id },
      data: {
        status: DeviceStatus.LOGGED_OUT,
        fcmToken: null,
      },
    });

    if (ttl > 0) {
      const redisClient = getRedisClient();
      await redisClient.set(
        createRedisKey(REDIS_PREFIXES.blacklist, token),
        token,
        'EX',
        ttl
      );
    }
    return;
  } catch (error) {
    throw error;
  }
};

