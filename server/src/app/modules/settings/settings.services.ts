import { DeviceStatus, RevokeReason } from '@prisma/client';
import prisma from '@/app/configs/db.configs';
import { hashPassword } from '@/app/utils/password.utils';
import { IChangePasswordParams } from '@/app/modules/settings/settings.types';

/**
 * This service changes the authenticated user's password.
 * The current password and reuse checks are performed by the
 * checkCurrentPassword middleware upstream. This service assumes
 * the request has already been validated and authorizes the change.
 *
 * @param param0 { user, deviceId, payload }
 * @returns Promise<void>
 */
export const changePasswordService = async ({
  user,
  deviceId,
  payload,
}: IChangePasswordParams): Promise<void> => {
  try {
    const { newPassword } = payload;
    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword },
      });

      await tx.device.updateMany({
        where: {
          userId: user.id,
          id: { not: deviceId },
          status: DeviceStatus.ACTIVE,
        },
        data: {
          status: DeviceStatus.REVOKED,
          revokeReason: RevokeReason.PASSWORD_CHANGED,
          fcmToken: null,
        },
      });
    });

    return;
  } catch (error) {
    throw error;
  }
};
