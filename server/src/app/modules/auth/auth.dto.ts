import { Role, UserStatus } from '@prisma/client';
import { SessionDTO } from '@/app/modules/profile/profile.dto';

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

export class LoginDTO {
  constructor(
    public token: string,
    public user: SessionDTO
  ) {}

  static buildLogin(token: string, user: SessionDTO) {
    return new LoginDTO(token, user);
  }
}
