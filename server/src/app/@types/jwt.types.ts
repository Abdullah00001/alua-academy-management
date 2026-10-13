import { UserStatus } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export interface ITokenPayload extends JwtPayload {
  sub: string;
  deviceId?: string;
  rememberMe?: boolean;
  role: string;
  accountStatus: UserStatus;
}

export interface AuthenticatedSocket extends Socket {
  user?: unknown;
  traceId?: string;
}
