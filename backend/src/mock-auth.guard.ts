import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from './auth/roles.enum';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    this.attachMockUser(request);
    return true;
  }

  // Nuevo método para obtener la request mockeada con usuario autenticado
  createMockRequest() {
    const request: any = {};
    this.attachMockUser(request);
    return request;
  }

  // Método privado para asignar el usuario autenticado
  private attachMockUser(request: any) {
    request.user = {
      sub: 1,
      username: 'usuarioAdmin',
      rol_id: Role.ADMIN,
    };
  }
}