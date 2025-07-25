import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded: any = jwt.decode(token);

      if (!decoded?.sub) throw new UnauthorizedException('Invalid token');

      request.user = { id: decoded.sub }; // attach Clerk user ID
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
