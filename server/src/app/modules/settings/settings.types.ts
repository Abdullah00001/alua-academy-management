import { User } from '@prisma/client';
import {
  TChangePasswordPayload,
  TUpdateLanguagePayload,
  TUpdateNotificationPayload,
} from '@/app/modules/settings/settings.schema';

export type {
  TChangePasswordPayload,
  TUpdateLanguagePayload,
  TUpdateNotificationPayload,
} from '@/app/modules/settings/settings.schema';

export interface IChangePasswordParams {
  user: User;
  deviceId: string;
  payload: TChangePasswordPayload;
}

export interface IGetSettingsParams {
  user: User;
}

export interface IUpdateLanguageParams {
  user: User;
  payload: TUpdateLanguagePayload;
}

export interface IUpdateNotificationParams {
  user: User;
  payload: TUpdateNotificationPayload;
}
