import prisma from '@/app/configs/db.configs';
import { getRedisClient } from '@/app/configs/redis.configs';
import { TSignupPayload } from '@/app/modules/auth/auth.types';
import { getEmailQueue } from '@/app/queues/email/email.queue';
import { generateOtpPageToken } from '@/app/utils/jwt.utils';
import { hashOtp } from '@/app/utils/otp.utils';
import { hashPassword } from '@/app/utils/password.utils';
import {
  calculateMilliseconds,
  createRedisKey,
  generate,
} from '@/app/utils/system.utils';
import { otpExpireAt, QUEUE_JOBS, REDIS_PREFIXES } from '@/const';

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
}): Promise<{ token: string }> => {
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
    return { token };
  } catch (error) {
    throw error;
  }
};
