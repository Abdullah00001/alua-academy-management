import {
  Language,
  Parent,
  Role,
  Teacher,
  User,
  UserPreference,
  UserStatus,
} from '@prisma/client';

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
    public language: Language
  ) {}

  static buildSession(user: User & { preferences?: UserPreference | null }) {
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
      // Defensive fallback for users created before the UserPreference
      // backfill, or in edge cases where the preference row was deleted.
      // After migration, every active user should have a preferences row.
      user.preferences?.language ?? Language.EN
    );
  }
}

export class ParentProfileSetupDTO extends SessionDTO {}

export class TeacherProfileSetupDTO extends SessionDTO {}

export class ParentProfileDTO {
  constructor(
    public userId: string,
    public fullName: string,
    public email: string,
    public phone: string,
    public avatarUrl: string | null,
    public language: Language,
    public createdAt: Date,
    public occupation: string | null,
    public address: string | null,
    public relationWithChild: string | null
  ) {}

  static build(
    user: User & { parent: Parent; preferences?: UserPreference | null }
  ) {
    return new ParentProfileDTO(
      user.id,
      user.fullName,
      user.email,
      user.phone,
      user.avatarUrl,
      user.preferences?.language ?? Language.EN,
      user.createdAt,
      user.parent.occupation,
      user.parent.address,
      user.parent.relationWithChild
    );
  }
}

export class TeacherProfileDTO {
  constructor(
    public userId: string,
    public fullName: string,
    public email: string,
    public phone: string,
    public avatarUrl: string | null,
    public language: Language,
    public createdAt: Date,
    public department: string | null,
    public designation: string | null,
    public bio: string | null
  ) {}

  static build(
    user: User & { teacher: Teacher; preferences?: UserPreference | null }
  ) {
    return new TeacherProfileDTO(
      user.id,
      user.fullName,
      user.email,
      user.phone,
      user.avatarUrl,
      user.preferences?.language ?? Language.EN,
      user.createdAt,
      user.teacher.department,
      user.teacher.designation,
      user.teacher.bio
    );
  }
}
