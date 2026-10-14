import { DeviceStatus, RevokeReason } from '@prisma/client';
import prisma from '@/app/configs/db.configs';
import { hashPassword } from '@/app/utils/password.utils';
import {
  IChangePasswordParams,
  IGetSettingsParams,
  IUpdateLanguageParams,
  IUpdateNotificationParams,
} from '@/app/modules/settings/settings.types';
import { SettingsDTO } from '@/app/modules/settings/settings.dto';

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

/**
 * This service retrieves the authenticated user's settings.
 * @param param0 { user }
 * @returns Promise<SettingsDTO>
 */
export const getSettingsService = async ({
  user,
}: IGetSettingsParams): Promise<SettingsDTO> => {
  try {
    const preferences = await prisma.userPreference.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });
    return SettingsDTO.build(preferences);
  } catch (error) {
    throw error;
  }
};

/**
 * This service updates the authenticated user's preferred language.
 * @param param0 { user, payload }
 * @returns Promise<SettingsDTO>
 */
export const updateLanguageService = async ({
  user,
  payload,
}: IUpdateLanguageParams): Promise<SettingsDTO> => {
  try {
    const preferences = await prisma.userPreference.upsert({
      where: { userId: user.id },
      create: { userId: user.id, language: payload.language },
      update: { language: payload.language },
    });
    return SettingsDTO.build(preferences);
  } catch (error) {
    throw error;
  }
};

/**
 * This service updates the authenticated user's notification preferences.
 * @param param0 { user, payload }
 * @returns Promise<SettingsDTO>
 */
export const updateNotificationService = async ({
  user,
  payload,
}: IUpdateNotificationParams): Promise<SettingsDTO> => {
  try {
    const preferences = await prisma.userPreference.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        notificationsPush: payload.push,
        notificationsEmail: payload.email,
      },
      update: {
        notificationsPush: payload.push,
        notificationsEmail: payload.email,
      },
    });
    return SettingsDTO.build(preferences);
  } catch (error) {
    throw error;
  }
};
