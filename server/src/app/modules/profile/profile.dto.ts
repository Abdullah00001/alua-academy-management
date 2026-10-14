import { Role, User, UserStatus } from '@prisma/client';

export class SessionDTO {
  constructor(
    public userId: string,
    public fullName: string,
    public email: string,
    public phone: string,
    public avatarUrl: string | null,
    public role: Role,
    public status: UserStatus,
    public isProfileSetup: boolean,
    public profileCompletedAt: Date | null,
    public language: string
  ) {}

  static buildSession(user: User) {
    return new SessionDTO(
      user.id,
      user.fullName,
      user.email,
      user.phone,
      user.avatarUrl,
      user.role,
      user.status,
      user.isProfileSetup,
      user.profileCompletedAt,
      user.language
    );
  }
}

export class ParentProfileSetupDTO extends SessionDTO {}

export class TeacherProfileSetupDTO extends SessionDTO {}
