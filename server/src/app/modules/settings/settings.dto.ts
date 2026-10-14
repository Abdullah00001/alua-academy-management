import { Language, UserPreference } from '@prisma/client';

export class NotificationSettingsDTO {
  constructor(
    public push: boolean,
    public email: boolean
  ) {}
}

export class SettingsDTO {
  constructor(
    public language: Language,
    public notifications: NotificationSettingsDTO
  ) {}

  static build(preferences: UserPreference) {
    return new SettingsDTO(
      preferences.language,
      new NotificationSettingsDTO(
        preferences.notificationsPush,
        preferences.notificationsEmail
      )
    );
  }
}
