import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';
import { Role } from './roles.enum';
import { AuthenticatedRequest } from './jwt-playload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!user) {
      throw new UnauthorizedException('No autenticado');
    }

    const tieneRolPermitido = requiredRoles.includes(user.rol_id);

    if (!tieneRolPermitido) {
      throw new ForbiddenException(
        'El rol de su usuario no tiene permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
