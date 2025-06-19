import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/usuario/usuario.controller';
import { UsersService } from '../src/usuario/usuario.service';
import { CreateUsuarioDto } from '../src/usuario/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../src/usuario/dto/update-usuario.dto';

import { mockUser, mockUsersArray } from '../src/mock-user';
import { mockUsersService } from '../src/mock-users-service';
import { AuthGuard } from '../src/auth/auth.guard';
import { MockAuthGuard } from '../src/mock-auth.guard';
import { APP_GUARD } from '@nestjs/core';

import { ExecutionContext } from '@nestjs/common';


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
        {
          provide: APP_GUARD,
          // Inyectamos el guard mockeado
          useClass: MockAuthGuard,  
        },
      ],
    })
    .overrideGuard(AuthGuard)
    // Reemplazamos el guard real por el mock guard
    .useClass(MockAuthGuard)  
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

      // Simulamos ExecutionContext (contexto de tiempo de ejecución) con la request vacía 
      const mockExecutionContext = {
       switchToHttp: () => ({
        getRequest: () => ({}),
        }),
      } as ExecutionContext;

      // Ejecutamos canActivate para que agregue user en request
      mockAuthGuard.canActivate(mockExecutionContext);

      // Obtenemos la request modificada
      const mockRequest = mockExecutionContext.switchToHttp().getRequest();

      // Configuramos el mock para devolver el usuario esperado en vez de 'null'
      (usersService.findOne as jest.Mock).mockResolvedValue(mockUser);

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

  describe('findOne', () => {
    it('debería retornar un usuario por id', async () => {
      const id = 1;
      // Simula el contexto y el guardia
      const mockAuthGuard = new MockAuthGuard();
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as ExecutionContext;

      mockAuthGuard.canActivate(mockExecutionContext);
      const mockRequest = mockExecutionContext.switchToHttp().getRequest();

      (usersService.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersController.findOne(id, mockRequest);
      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith(id, mockRequest.user);
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario', async () => {
      const id = 1;
      const updateDto: UpdateUsuarioDto = { nombre: 'Usuario2' };
      const mockAuthGuard = new MockAuthGuard();
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as ExecutionContext;

      mockAuthGuard.canActivate(mockExecutionContext);
      const mockRequest = mockExecutionContext.switchToHttp().getRequest();

      (usersService.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersController.update(id, updateDto, mockRequest);
      expect(result).toEqual(mockUser);
      expect(usersService.update).toHaveBeenCalledWith(id, updateDto, mockRequest.user);
    });
  });

  describe('remove', () => {
    it('debería eliminar un usuario', async () => {
      const id = 1;
      const mockAuthGuard = new MockAuthGuard();
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as ExecutionContext;
      mockAuthGuard.canActivate(mockExecutionContext);
      const mockRequest = mockExecutionContext.switchToHttp().getRequest();

      (usersService.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await usersController.remove(id, mockRequest);
      expect(result).toBeUndefined();
      expect(usersService.remove).toHaveBeenCalledWith(id, mockRequest.user);
    });
  });
});
