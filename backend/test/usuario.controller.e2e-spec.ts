import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/usuario/usuario.controller';
import { UsersService } from '../src/usuario/usuario.service';
import { CreateUsuarioDto } from '../src/usuario/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../src/usuario/dto/update-usuario.dto';
import { Role } from '../src/auth/roles.enum';
import { mockUser, mockUsersArray } from './mock-user';
import { mockUsersService } from './mock-users-service';
import { AuthGuard } from '../src/auth/auth.guard';
import { MockAuthGuard } from './mock-auth.guard';
import { APP_GUARD } from '@nestjs/core';

import { ExecutionContext } from '@nestjs/common';
import { request } from 'http';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
/*         {
          provide: APP_GUARD,
          useClass: MockAuthGuard,  // Aquí inyectamos el guard mockeado
        }, */
      ],
    })
    //.overrideGuard(AuthGuard)
    //.useClass(MockAuthGuard)  // Reemplazo del guard real por el mock guard
    .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  // Reseteamos el mock object luego de cada test
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('findAll', () => {
    it('debería retornar un arreglo de usuarios', async () => {
      const result = await usersController.findAll();
      expect(result).toEqual(mockUsersArray);
      expect(usersService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPerfil', () => { 
    it('debería retornar el perfil del usuario autenticado', async () => {
      const usuarioId = 1;
      //const mockRequest = { user: { id: usuarioId, rol_id: Role.ADMIN } } as any; 
      const mockAuthGuard = new MockAuthGuard();

      // Simulamos ExecutionContext (tiempo de ejecución) con request vacío 
      const mockExecutionContext = {
       switchToHttp: () => ({
        getRequest: () => ({}),
        }),
      } as ExecutionContext;

      // Ejecutamos canActivate para que agregue user en request
      mockAuthGuard.canActivate(mockExecutionContext);

      // Obtenemos la request modificada
      const mockRequest = mockExecutionContext.switchToHttp().getRequest();

      const result = await usersController.getPerfil(usuarioId, mockRequest);
      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith(usuarioId, mockRequest.user);
    });
  });

  describe('create', () => {
    it('debería crear un nuevo usuario', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'usuariotest@gmail.com',
        nombre: 'Usuario',
        apellido: 'Test',
        contrasenia: '123456'
      };

      const result = await usersController.create(createDto);
      expect(result).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalledWith(createDto);
    });
  });

/*   describe('findOne', () => { // req: AuthenticatedRequest
    it('debería retornar un usuario por id', async () => {
      const id = 1;
      const mockRequest = { user: { id: 1, rol_id: Role.ADMIN } } as any;

      const result = await usersController.findOne(id, mockRequest);
      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith(id, mockRequest.user);
    });
  });

  describe('update', () => { // req: AuthenticatedRequest
    it('debería actualizar un usuario', async () => {
      const id = 1;
      const updateDto: UpdateUsuarioDto = {
        nombre: 'Usuario2',
      };
      const mockRequest = { user: { id: 1, rol_id: Role.PUBLICADOR } } as any;

      const result = await usersController.update(id, updateDto, mockRequest);
      expect(result).toEqual(mockUser);
      expect(usersService.update).toHaveBeenCalledWith(id, updateDto, mockRequest.user);
    });
  });

  describe('remove', () => { // req: AuthenticatedRequest
    it('debería eliminar un usuario', async () => {
      const id = 1;
      const mockRequest = { user: { id: 1, rol_id: Role.PUBLICADOR } } as any;

      const result = await usersController.remove(id, mockRequest);
      expect(result).toBeUndefined();
      expect(usersService.remove).toHaveBeenCalledWith(id, mockRequest.user);
    });
  }); */
});