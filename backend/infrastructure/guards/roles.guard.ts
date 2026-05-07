import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('No autorizado');
    }

    
    const roleHierarchy = { SUPERADMIN: 3, ADMIN: 2, USER: 1 };
    const userRoleLevel = roleHierarchy[user.rol as keyof typeof roleHierarchy] || 0;

    const hasPermission = roles.some(role => {
      const requiredLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
      return userRoleLevel >= requiredLevel;
    });

    if (!hasPermission) {
      throw new ForbiddenException('Permiso denegado');
    }

    return true;
  }
}
