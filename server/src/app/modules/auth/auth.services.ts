import prisma from '@/app/configs/db.configs';
import { getRedisClient } from '@/app/configs/redis.configs';
import {
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
import { SignupDTO, VerifySignupUserDTO } from '@/app/modules/auth/auth.dto';
import {
  DeviceStatus,
  Platform,
  RevokeReason,
  User,
  UserStatus,
} from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

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
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPass,
        phone,
        isLegalTermAccepted,
        role,
      },
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
    const { updatedUser } = await prisma.$transaction(async (tx) => {
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
          profileCompletedAt: new Date(),
          lastLoginAt: new Date(),
        },
      });

      // 4. Create new device session
      await tx.device.create({
        data: {
          userId: user.id,
          deviceIdentifier,
          fcmToken: fcmToken,
          platform: platform as Platform,
          status: DeviceStatus.ACTIVE,
          sessionExpiresAt,
        },
      });

      return { updatedUser };
    });

    const accessToken = generateAccessTokenForUser({
      role: updatedUser.role,
      sub: updatedUser.id,
      deviceId: deviceIdentifier,
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
