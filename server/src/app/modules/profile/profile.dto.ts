import { Role, UserStatus } from '@prisma/client';

export class ParentProfileSetupDTO {
  constructor(
    public userId: string,
    public fullName: string,
    public avatarUrl: string | null,
    public role: Role,
    public status: UserStatus,
    public isProfileSetup: boolean,
    public profileCompletedAt: Date | null
  ) {}
}
