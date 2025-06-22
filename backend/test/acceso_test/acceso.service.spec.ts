import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccesoService } from '../../src/acceso/acceso.service';
import { Role } from '../../src/auth/roles.enum';

interface JwtPayload {
  sub: number; 
  username: string;   
  rol_id: number; 
}

describe('AccesoService', () => {
  let service: AccesoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccesoService],
    })
      .compile();

    service = module.get<AccesoService>(AccesoService);
  });

  describe('verificarAcceso', () => {
    it('debería permitir acceso si el usuario es admin', () => {
      const usuarioAuth: JwtPayload = { sub: 1, username: 'Admin', rol_id: Role.ADMIN };
      const recurso = { usuario_id: 1 };

      expect(() => service.verificarAcceso(usuarioAuth, recurso)).not.toThrow();
    });

    it('debería permitir acceso si el usuario es dueño del recurso', () => {
      // rol_id diferente al usuario admin
      const usuarioAuth: JwtPayload = { sub: 2, username: 'Marcos', rol_id: Role.PUBLICADOR }; 
      const recurso = { usuario_id: 2 };

      expect(() => service.verificarAcceso(usuarioAuth, recurso)).not.toThrow();
    });

    it('debería lanzar ForbiddenException si no es admin ni dueño', () => {
      // No es admin y no es dueño
      const usuarioAuth: JwtPayload = { sub: 1, username: 'Carlos', rol_id: Role.PUBLICADOR }; 
      const recurso = { usuario_id: 3 };

      expect(() => service.verificarAcceso(usuarioAuth, recurso)).toThrow(ForbiddenException);
      expect(() => service.verificarAcceso(usuarioAuth, recurso)).toThrow('No tiene permisos para acceder a este recurso');
    });
  });

  describe('verificarUsuarioDeRuta', () => {
    it('debería permitir acceso si el usuario es admin', () => {
      const usuario: JwtPayload = { sub: 1, username: 'Admin', rol_id: Number(Role.ADMIN) };
      const usuarioIdRuta = 1;

      expect(() => service.verificarUsuarioDeRuta(usuario, usuarioIdRuta)).not.toThrow();
    });

    it('debería permitir acceso si el usuario es el mismo que el de la ruta', () => {
      const usuario: JwtPayload = { sub: 2, username: 'Marcos', rol_id: Role.PUBLICADOR };
      const usuarioIdRuta = 2;

      expect(() => service.verificarUsuarioDeRuta(usuario, usuarioIdRuta)).not.toThrow();
    });

    it('debería lanzar ForbiddenException si no es admin ni el usuario de la ruta', () => {
      const usuario: JwtPayload = { sub: 1, username: 'Carlos', rol_id: Role.PUBLICADOR };
      const usuarioIdRuta = 3;

      expect(() => service.verificarUsuarioDeRuta(usuario, usuarioIdRuta)).toThrow(ForbiddenException);
      expect(() => service.verificarUsuarioDeRuta(usuario, usuarioIdRuta)).toThrow('No tiene permisos para acceder a recursos de otro usuario');
    });
  });
});
