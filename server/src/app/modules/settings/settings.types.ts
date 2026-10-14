import { User } from '@prisma/client';
import { TChangePasswordPayload } from '@/app/modules/settings/settings.schema';

export type { TChangePasswordPayload } from '@/app/modules/settings/settings.schema';

export interface IChangePasswordParams {
  user: User;
  deviceId: string;
  payload: TChangePasswordPayload;
}
