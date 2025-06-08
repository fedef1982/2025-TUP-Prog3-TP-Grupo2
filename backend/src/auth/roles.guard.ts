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
import { AuthenticatedRequest } from './auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line prettier/prettier
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(),context.getClass(),]);
    console.log('Método actual:', context.getHandler().name);
    console.log('requiredRoles:', requiredRoles);
    console.log(
      'Desde handler:',
      this.reflector.get<number[]>(ROLES_KEY, context.getHandler()),
    );
    console.log(
      'Desde clase:',
      this.reflector.get<number[]>(ROLES_KEY, context.getClass()),
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!user) {
      throw new UnauthorizedException('No autenticado');
    }

    const tieneRolPermitido = requiredRoles.includes(user.rol_id);
    console.log('rol_id_logueado:', user.rol_id);

    if (!tieneRolPermitido) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
