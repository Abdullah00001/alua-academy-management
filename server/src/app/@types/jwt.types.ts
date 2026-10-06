import { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export interface ITokenPayload extends JwtPayload {
  sub: string;
  deviceId?: string;
  rememberMe?: boolean;
  role: string;
  isVerified: boolean;
  accountStatus: string;
}

export interface AuthenticatedSocket extends Socket {
  user?: unknown;
  traceId?: string;
}
