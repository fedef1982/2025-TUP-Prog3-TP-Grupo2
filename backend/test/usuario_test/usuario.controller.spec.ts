import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/usuario/usuario.controller';
import { UsersService } from '../../src/usuario/usuario.service';
import { mockUserData } from '../_mocks_/usuario.model.mock';
import { EstadisticasUsuarioDto } from '../../src/usuario/dto/estadisticas-usuario.dto';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';
import { AuthenticatedRequest } from '../../src/auth/jwt-playload.interface';
import { Role } from '../../src/auth/roles.enum';

const mockUsersService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getEstadisticas: jest.fn(),
  findUsuariosConFiltros: jest.fn(),
};

const reqAdmin = {
  user: { sub: 1, rol_id: Number(Role.ADMIN), username: 'admin@gmailcom' },
} as AuthenticatedRequest;
const reqPublicador = {
  user: { sub: 2, rol_id: Number(Role.PUBLICADOR), username: 'user@gmail.com' },
} as AuthenticatedRequest;

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    Object.values(mockUsersService).forEach((fn) => fn.mockReset());

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('debería devolver todos los usuarios', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUserData]);
      const result = await controller.findAll();
      expect(result).toEqual([mockUserData]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería devolver el usuario correspondiente', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUserData);
      const result = await controller.findOne(1, reqAdmin);
      expect(result).toEqual(mockUserData);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1, reqAdmin.user);
    });
  });

  describe('create', () => {
    it('debería crear y devolver el usuario', async () => {
      mockUsersService.create.mockResolvedValue(mockUserData);
      const dto = {
        email: 'nuevo@example.com',
        nombre: 'Nuevo',
        apellido: 'Usuario',
        contrasenia: '123456',
        telefono: '123456789',
        direccion: 'Calle Falsa 123',
      };
      const result = await controller.create(dto);
      expect(result).toEqual(mockUserData);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('debería actualizar y devolver el usuario', async () => {
      mockUsersService.update.mockResolvedValue(mockUserData);
      const dto = { nombre: 'Cambiado' };
      const result = await controller.update(1, dto, reqPublicador);
      expect(result).toEqual(mockUserData);
      expect(mockUsersService.update).toHaveBeenCalledWith(
        1,
        dto,
        reqPublicador.user,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar el usuario', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);
      await controller.remove(1, reqAdmin);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1, reqAdmin.user);
    });
  });

  describe('getPerfil', () => {
    it('debería devolver el perfil del usuario', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUserData);
      const result = await controller.getPerfil(1, reqPublicador);
      expect(result).toEqual(mockUserData);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        1,
        reqPublicador.user,
      );
    });
  });

  describe('getEstadisticas', () => {
    it('debería devolver las estadísticas del usuario', async () => {
      const estadisticas: EstadisticasUsuarioDto = {
        totalUsuarios: 5,
        totalMascotas: 10,
        totalPublicaciones: 2,
        totalVisitas: 3,
      };
      mockUsersService.getEstadisticas.mockResolvedValue(estadisticas);
      const result = await controller.getEstadisticas(1, reqAdmin);
      expect(result).toEqual(estadisticas);
      expect(mockUsersService.getEstadisticas).toHaveBeenCalledWith(
        1,
        reqAdmin.user,
      );
    });
  });

  describe('findUsuariosConFiltros', () => {
    it('debería devolver usuarios filtrados', async () => {
      const params: QueryOpcionesDto = { q: 'ana', page: 1, limit: 2 };
      const response = {
        users: [mockUserData],
        total: 1,
        totalPages: 1,
      };
      mockUsersService.findUsuariosConFiltros.mockResolvedValue(response);

      const result = await controller.findUsuariosConFiltros(
        1,
        reqAdmin,
        params,
      );

      expect(result).toEqual(response);
      expect(mockUsersService.findUsuariosConFiltros).toHaveBeenCalledWith(
        1,
        reqAdmin.user,
        params,
      );
    });
  });
});
