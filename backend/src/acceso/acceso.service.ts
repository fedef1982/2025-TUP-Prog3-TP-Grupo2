import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/auth.guard';
import { Role } from 'src/auth/roles.enum';

@Injectable()
export class AccesoService {
  verificarAcceso(
    usuarioAuth: JwtPayload,
    recurso: { usuario_id: number },
  ): void {
    const esAdmin = usuarioAuth.rol_id === Number(Role.ADMIN);
    const esDuenio = usuarioAuth.sub === recurso.usuario_id;

    if (!esAdmin && !esDuenio) {
      throw new ForbiddenException(
        'El rol de su usuario no tiene permisos para acceder a este recurso',
      );
    }
  }
}
