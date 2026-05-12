// src/auth/guard/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new UnauthorizedException('auth.UNAUTHORIZED');
    }

    const userRole = String(user.role).toLowerCase();
    const normalizedRequiredRoles = requiredRoles.map((role) =>
      String(role).toLowerCase(),
    );

    if (!normalizedRequiredRoles.includes(userRole)) {
      throw new ForbiddenException('auth.FORBIDDEN');
    }

    return true;
  }
}
