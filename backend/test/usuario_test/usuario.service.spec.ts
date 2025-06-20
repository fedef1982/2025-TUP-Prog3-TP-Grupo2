jest.mock('bcrypt', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
}));
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/usuario/usuario.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../../src/usuario/usuario.model';
import { Rol } from '../../src/usuario/rol.model';
import { AccesoService } from '../../src/acceso/acceso.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Publicacion } from '../../src/publicacion/publicacion.model';
import { Mascota } from '../../src/mascota/mascota.model';
import { Visita } from '../../src/visita/visita.model';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: typeof User;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    update: jest.fn(),
  } as unknown as User;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const mockAccesoService = {
    verificarUsuarioDeRuta: jest.fn(),
    verificarAcceso: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: mockUserModel },
        { provide: getModelToken(Mascota), useValue: {} },
        { provide: getModelToken(Publicacion), useValue: {} },
        { provide: getModelToken(Visita), useValue: {} },
        { provide: AccesoService, useValue: mockAccesoService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<typeof User>(getModelToken(User));
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('debería devolver todos los usuarios con su rol incluido', async () => {
      const usuariosMock: User[] = [
        { id: 1, email: 'test1@example.com', rol_id: 2 } as User,
        { id: 2, email: 'test2@example.com', rol_id: 2 } as User,
      ];
      mockUserModel.findAll = jest.fn().mockResolvedValue(usuariosMock);
      const result = await service.findAll();
      expect(mockUserModel.findAll).toHaveBeenCalledWith({
        include: [Rol],
      });
      expect(result).toEqual(usuariosMock);
    });
  });

  describe('findByEmail', () => {
    it('debería devolver un usuario si el email existe', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(result).toBe(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: [Rol],
      });
    });

    it('debería lanzar NotFoundException si el email no existe', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('otro@example.com')).rejects.toThrow(
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

      mockUserModel.findOne.mockResolvedValue(null);
      const usuarioEsperado = {
        id: 2,
        ...dto,
        contrasenia: 'hashed_123456',
        rol_id: 2,
      };
      mockUserModel.create.mockResolvedValue(usuarioEsperado);

      const result = await service.create(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        email: dto.email,
        nombre: dto.nombre,
        apellido: dto.apellido,
        contrasenia: 'hashed_123456',
        rol_id: 2,
        telefono: dto.telefono,
        direccion: dto.direccion,
      });
      expect(result).toEqual(usuarioEsperado);
    });

    it('debería lanzar ConflictException si el email ya está registrado', async () => {
      const dto = {
        email: 'test@example.com',
        nombre: 'Test',
        apellido: 'User',
        contrasenia: '123456',
        telefono: '123456789',
        direccion: 'Calle 123',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario con nueva contraseña hasheada', async () => {
      const dto = {
        contrasenia: 'nueva123',
      };
      mockUserModel.findOne.mockResolvedValue(null);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      const updateMock = jest.fn().mockResolvedValue(undefined);
      mockUser.update = updateMock;
      const result = await service.update(1, dto, {
        sub: 1,
        username: '',
        rol_id: 2,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('nueva123', 10);
      expect(updateMock).toHaveBeenCalledWith({
        contrasenia: 'hashed_nueva123',
      });
      expect(result).toBe(mockUser);
    });

    it('debería validar email único si se cambia el email', async () => {
      const dto = {
        email: 'nuevo@example.com',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockUser,
        email: 'viejo@example.com',
        update: jest.fn(),
      } as unknown as User);
      mockUserModel.findOne.mockResolvedValue(null);

      await service.update(1, dto, { sub: 1, username: '', rol_id: 2 });

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'nuevo@example.com' },
      });
    });
  });

  describe('remove', () => {
    it('debería eliminar un usuario', async () => {
      const userMockConDestroy = {
        destroy: jest.fn(),
      };
      (service.findOne as jest.Mock) = jest
        .fn()
        .mockResolvedValue(userMockConDestroy);
      await service.remove(1, { sub: 1, username: '', rol_id: 2 });
      expect(service.findOne).toHaveBeenCalledWith(1, {
        sub: 1,
        username: '',
        rol_id: 2,
      });

      expect(userMockConDestroy.destroy).toHaveBeenCalled();
    });
  });
});
