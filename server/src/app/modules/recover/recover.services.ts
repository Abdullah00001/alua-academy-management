import {
  calculateMilliseconds,
  createRedisKey,
  generate,
} from '@/app/utils/system.utils';
import {
  TFindRecoverUserByEmailServiceParams,
  TResendRecoverUserOtpServiceParams,
} from '@/app/modules/recover/recover.types';
import { hashOtp } from '@/app/utils/otp.utils';
import { generateResetPasswordPageToken } from '@/app/utils/jwt.utils';
import { otpExpireAt, QUEUE_JOBS, REDIS_PREFIXES } from '@/const';
import { FindRecoverUserServiceDTO } from '@/app/modules/recover/recover.dto';
import { getRedisClient } from '@/app/configs/redis.configs';
import { getEmailQueue } from '@/app/queues/email/email.queue';

/**
 * This service is for find the recover user
 * @param param0 { traceId: string, user: User }
 * @returns Promise<FindRecoverUserServiceDTO>
 */
export const findRecoverUserService = async ({
  traceId,
  user,
}: TFindRecoverUserByEmailServiceParams): Promise<FindRecoverUserServiceDTO> => {
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
    const token = generateResetPasswordPageToken({
      accountStatus: user.status,
      role: user.role,
      sub: user.id,
    });
    const emailPayload = {
      name: user.fullName,
      email: user.email,
      otp,
      otpExpireAt,
      traceId,
    };
    await Promise.all([
      redisClient.set(
        createRedisKey(REDIS_PREFIXES.otp, user.id.toString()),
        hashedOtp,
        'EX',
        calculateMilliseconds(otpExpireAt, 'minutes')
      ),
      emailQueue.add(QUEUE_JOBS.SEND_RECOVER_USER_OTP, emailPayload),
    ]);
    return FindRecoverUserServiceDTO.build({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatarUrl,
      token,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * This service is for resend the otp to the user.
 * @param param0 { traceId: string, user: User }
 * @returns Promise<void>
 */
export const resendRecoverUserOtpService = async ({
  traceId,
  user,
}: TResendRecoverUserOtpServiceParams): Promise<void> => {
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
    const emailPayload = {
      name: user.fullName,
      email: user.email,
      otp,
      otpExpireAt,
      traceId,
    };
    await Promise.all([
      redisClient.set(
        createRedisKey(REDIS_PREFIXES.otp, user.id.toString()),
        hashedOtp,
        'EX',
        calculateMilliseconds(otpExpireAt, 'minutes')
      ),
      emailQueue.add(QUEUE_JOBS.RESEND_VERIFICATION_OTP, emailPayload),
    ]);
    return;
  } catch (error) {
    throw error;
  }
};
