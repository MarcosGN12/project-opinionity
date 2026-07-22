import { JwtPayload } from './jwtPayload';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}
