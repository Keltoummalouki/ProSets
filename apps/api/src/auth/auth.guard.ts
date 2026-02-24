import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { sub: string; email: string };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    // For now, auth is optional - mock user if no header provided
    if (!authHeader) {
      request.user = { sub: 'user-1', email: 'user@example.com' };
      return true;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    // TODO: Validate JWT token with Auth0
    // For now, we'll just check if token exists
    request.user = { sub: 'user-id', email: 'user@example.com' };

    return true;
  }
}
