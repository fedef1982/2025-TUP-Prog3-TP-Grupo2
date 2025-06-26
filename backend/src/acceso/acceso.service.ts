import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt-playload.interface';
import { Role } from '../../src/auth/roles.enum';

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
        `No tiene permisos para acceder a este recurso`,
      );
    }
  }

  verificarUsuarioDeRuta(usuario: JwtPayload, usuarioIdRuta: number): void {
    const esAdmin = usuario.rol_id === Number(Role.ADMIN);
    const esUsuarioLogueado = usuario.sub === usuarioIdRuta;

    if (!esAdmin && !esUsuarioLogueado) {
      throw new ForbiddenException(
        `No tiene permisos para acceder a recursos de otro usuario`,
      );
    }
  }
}
