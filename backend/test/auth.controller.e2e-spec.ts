import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { AuthController } from '../src/auth/auth.controller';
import { AuthGuard } from '../src/auth/auth.guard';
import { AuthService } from '../src/auth/auth.service';
import { Role } from '../src/auth/roles.enum';
import * as jwt from 'jsonwebtoken';
import { afterEach, beforeEach } from 'node:test';
import { RolesGuard } from '../src/auth/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LoginDto } from '../src/auth/dto/login.dto';

const mockUser = {
  sub: 1,
  username: 'testUser',
  rol_id: Role.PUBLICADOR,
};

class MockAuthGuard {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = mockUser;
    return true;
  }
}

const mockAuthService = {
  validateUser: jest.fn().mockResolvedValue(() => {
    // Generamos el token JWT simulado
    const token = jwt.sign(mockUser, 'TP-GRUPO2-PROG-ADOPTAR', { expiresIn: '1h' });
    return { access_token: token };
  }),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: APP_GUARD,
          useClass: MockAuthGuard,  
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach( () => {
    jest.clearAllMocks(); 
  });

  describe('signIn', () => {
    it('debería llamar a authService.signIn con email y contraseña y retornar el resultado', async () => {
      const loginDto: LoginDto = {
        email: 'testuser@gmail.com',
        contrasenia: '123456',
      };

      const expectedResult = { accessToken: 'token123' };

      // Mockeamos la implementación del servicio
      jest.spyOn(authService, 'signIn').mockResolvedValue(expectedResult);

      const result = await authController.signIn(loginDto);

      expect(authService.signIn).toHaveBeenCalledWith(loginDto.email, loginDto.contrasenia);
      expect(result).toBe(expectedResult);
    });    
  });
});
