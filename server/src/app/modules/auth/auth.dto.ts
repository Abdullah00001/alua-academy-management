import { Role, UserStatus } from '@prisma/client';

export class SignupDTO {
  constructor(public token: string) {}
}

export class VerifySignupUserDTO {
  constructor(
    public accessToken: string,
    public isProfileSetup: boolean,
    public role: Role,
    public accountStatus: UserStatus,
    public id: string,
    public fullName: string,
    public avatarUrl: string | null
  ) {}
}
