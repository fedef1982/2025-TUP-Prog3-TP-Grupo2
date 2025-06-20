import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/usuario/usuario.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../../src/usuario/usuario.model';
import { Rol } from '../../src/usuario/rol.model';
import { AccesoService } from '../../src/acceso/acceso.service';
import { Publicacion } from '../../src/publicacion/publicacion.model';
import { Mascota } from '../../src/mascota/mascota.model';
import { Visita } from '../../src/visita/visita.model';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../src/auth/jwt-playload.interface';
import { Role } from '../../src/auth/roles.enum';
import { Op } from 'sequelize';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';
import {
  mockUserData,
  mockUserModel as makeUserModel,
} from './_mocks_/usuario.model.mock';
import { mockMascotaModel } from './_mocks_/mascota.model.mock';
import { mockPublicacionModel } from './_mocks_/publicacion.model.mock';
import { mockVisitaModel } from './_mocks_/visita.model.mock';
import { mockAccesoService as makeAccesoService } from './_mocks_/acceso.service.mock';
import { DeepMockProxy } from 'jest-mock-extended';

jest.mock('bcrypt', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userModel: DeepMockProxy<typeof User>;
  let mascotaModel: DeepMockProxy<typeof Mascota>;
  let publicacionModel: DeepMockProxy<typeof Publicacion>;
  let visitaModel: DeepMockProxy<typeof Visita>;
  let accesoService: DeepMockProxy<AccesoService>;

  beforeEach(async () => {
    userModel = makeUserModel();
    mascotaModel = mockMascotaModel();
    publicacionModel = mockPublicacionModel();
    visitaModel = mockVisitaModel();
    accesoService = makeAccesoService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Mascota), useValue: mascotaModel },
        { provide: getModelToken(Publicacion), useValue: publicacionModel },
        { provide: getModelToken(Visita), useValue: visitaModel },
        { provide: AccesoService, useValue: accesoService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería devolver todos los usuarios con su rol incluido', async () => {
      const usuariosMock: User[] = [
        { id: 1, email: 'test1@example.com', rol_id: 2 } as User,
        { id: 2, email: 'test2@example.com', rol_id: 2 } as User,
      ];
      userModel.findAll.mockResolvedValue(usuariosMock);

      const result = await service.findAll();

      expect(userModel.findAll).toHaveBeenCalledWith({ include: [Rol] });
      expect(result).toEqual(usuariosMock);
    });
  });

  describe('findByEmail', () => {
    it('debería devolver un usuario si el email existe', async () => {
      userModel.findOne.mockResolvedValue(mockUserData);

      const result = await service.findByEmail(mockUserData.email);

      expect(result).toBe(mockUserData);
      expect(userModel.findOne).toHaveBeenCalledWith({
        where: { email: mockUserData.email },
        include: [Rol],
      });
    });

    it('debería lanzar NotFoundException si el email no existe', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('otro@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    const usuarioMock: JwtPayload = {
      sub: 1,
      username: 'test@mail.com',
      rol_id: 2,
    };

    it('debería devolver el usuario si existe y el acceso es válido', async () => {
      userModel.findByPk.mockResolvedValue(mockUserData);

      const result = await service.findOne(1, usuarioMock);

      expect(accesoService.verificarUsuarioDeRuta).toHaveBeenCalledWith(
        usuarioMock,
        1,
      );
      expect(userModel.findByPk).toHaveBeenCalledWith(1, { include: [Rol] });
      expect(accesoService.verificarAcceso).toHaveBeenCalledWith(usuarioMock, {
        usuario_id: mockUserData.id,
      });
      expect(result).toBe(mockUserData);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999, usuarioMock)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('debería crear un usuario con contraseña hasheada', async () => {
      const dto = {
        email: 'nuevo@example.com',
        nombre: 'Nuevo',
        apellido: 'Usuario',
        contrasenia: '123456',
        telefono: '123456789',
        direccion: 'Calle Falsa 123',
      };

      userModel.findOne.mockResolvedValue(null);

      const usuarioEsperado = {
        ...mockUserData,
        ...dto,
        id: 2,
        contrasenia: 'hashed_123456',
        rol_id: Role.PUBLICADOR,
      } as User;
      userModel.create.mockResolvedValue(usuarioEsperado);

      const result = await service.create(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(userModel.create).toHaveBeenCalledWith({
        email: dto.email,
        nombre: dto.nombre,
        apellido: dto.apellido,
        contrasenia: 'hashed_123456',
        rol_id: Role.PUBLICADOR,
        telefono: dto.telefono,
        direccion: dto.direccion,
      });
      expect(result).toEqual(usuarioEsperado);
    });

    it('debería lanzar ConflictException si el email ya está registrado', async () => {
      userModel.findOne.mockResolvedValue(mockUserData);

      const dto = {
        email: mockUserData.email,
        nombre: 'Test',
        apellido: 'User',
        contrasenia: '123456',
        telefono: '123456789',
        direccion: 'Calle 123',
      };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(userModel.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario con nueva contraseña hasheada', async () => {
      const dto = {
        contrasenia: 'nueva123',
      };
      userModel.findOne.mockResolvedValue(null);

      const updateMock = jest.fn();
      const userMock = {
        ...mockUserData,
        update: updateMock,
      } as unknown as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(userMock);

      const result = await service.update(1, dto, {
        sub: 1,
        username: '',
        rol_id: 2,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('nueva123', 10);
      expect(updateMock).toHaveBeenCalledWith({
        contrasenia: 'hashed_nueva123',
      });
      expect(result).toBe(userMock);
    });

    it('debería verificar la unicidad del email si se actualiza el campo email', async () => {
      const dto = {
        email: 'nuevo@example.com',
      };

      const userMock = {
        ...mockUserData,
        email: 'viejo@example.com',
        update: jest.fn(),
      } as unknown as User;
      jest.spyOn(service, 'findOne').mockResolvedValue(userMock);
      userModel.findOne.mockResolvedValue(null);

      await service.update(1, dto, { sub: 1, username: '', rol_id: 2 });

      expect(userModel.findOne).toHaveBeenCalledWith({
        where: { email: 'nuevo@example.com' },
      });
    });
  });

  describe('remove', () => {
    it('debería eliminar un usuario', async () => {
      const userMockConDestroy = {
        ...mockUserData,
        destroy: jest.fn(),
      } as unknown as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(userMockConDestroy);
      await service.remove(1, { sub: 1, username: '', rol_id: 2 });
      expect(service.findOne).toHaveBeenCalledWith(1, {
        sub: 1,
        username: '',
        rol_id: 2,
      });
      expect(userMockConDestroy.destroy).toHaveBeenCalled();
    });
  });

  describe('getEstadisticas', () => {
    it('debería devolver estadísticas completas para un usuario ADMIN', async () => {
      const mockUsuarioAdmin = {
        sub: 1,
        rol_id: Role.ADMIN,
        username: 'admin',
      };

      userModel.count.mockResolvedValue(5);
      mascotaModel.count.mockResolvedValue(10);
      publicacionModel.count.mockResolvedValue(15);
      visitaModel.count.mockResolvedValue(20);

      const result = await service.getEstadisticas(1, mockUsuarioAdmin);

      expect(accesoService.verificarUsuarioDeRuta).toHaveBeenCalledWith(
        mockUsuarioAdmin,
        1,
      );

      expect(result).toEqual({
        totalUsuarios: 5,
        totalMascotas: 10,
        totalPublicaciones: 15,
        totalVisitas: 20,
      });
    });

    it('debería devolver estadísticas filtradas por usuario si es PUBLICADOR', async () => {
      const mockUsuarioPublicador = {
        sub: 2,
        rol_id: Role.PUBLICADOR,
        username: 'publicador',
      };
      mascotaModel.count.mockResolvedValue(2);
      publicacionModel.count.mockResolvedValue(3);
      visitaModel.count.mockResolvedValue(4);

      const result = await service.getEstadisticas(2, mockUsuarioPublicador);

      expect(result).toEqual({
        totalUsuarios: 1,
        totalMascotas: 2,
        totalPublicaciones: 3,
        totalVisitas: 4,
      });
    });
  });

  describe('findUsuariosConFiltros', () => {
    it('debería devolver solo el propio usuario si el rol es PUBLICADOR', async () => {
      const usuarioMock = { sub: 5, rol_id: Role.PUBLICADOR, username: 'user' };
      const userMock = { ...mockUserData, id: 5, nombre: 'Juan' } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(userMock);

      const result = await service.findUsuariosConFiltros(5, usuarioMock, {
        page: 1,
        limit: 10,
      });

      expect(service.findOne).toHaveBeenCalledWith(5, usuarioMock);
      expect(result).toEqual({
        users: [userMock],
        total: 1,
        totalPages: 1,
      });
    });

    it('debería devolver usuarios con filtros si el rol es ADMIN', async () => {
      const usuarioAdmin = { sub: 1, rol_id: Role.ADMIN, username: 'admin' };
      const params: QueryOpcionesDto = {
        q: 'ana',
        page: 2,
        limit: 2,
        sortBy: 'apellido',
        sortOrder: 'desc',
      };

      const mockRows = [
        { ...mockUserData, id: 1, nombre: 'Ana' },
        { ...mockUserData, id: 2, nombre: 'Analia' },
      ] as User[];
      const mockCount = 6;

      userModel.findAndCountAll.mockResolvedValue({
        rows: mockRows,
        count: mockCount,
      } as any);

      const result = await service.findUsuariosConFiltros(
        1,
        usuarioAdmin,
        params,
      );

      expect(userModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%ana%` } },
            { apellido: { [Op.iLike]: `%ana%` } },
            { email: { [Op.iLike]: `%ana%` } },
          ],
        },
        limit: 2,
        offset: 2,
        order: [['apellido', 'desc']],
        include: [{ model: Rol }],
      });

      expect(result).toEqual({
        users: mockRows,
        total: mockCount,
        totalPages: 3,
      });
    });
  });
});
