import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { AuthService } from '../src/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { afterEach, beforeEach } from 'node:test';
import { RolesGuard } from '../src/auth/roles.guard';
import { ConfigModule } from '@nestjs/config';

const mockUser = {
  sub: 1,
  username: 'testUser',
  rol_id: 2,
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
    const token = jwt.sign(mockUser, 'test-adoptar', { expiresIn: '1h' });
    return { access_token: token };
  }),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          storage: ':memory:', // usa memoria para test, evita archivos físicos
          autoLoadModels: true,
          synchronize: true,
          logging: false,
        }),
        AuthModule,
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideProvider(AuthService)
      .useValue({
        validateUser: jest.fn().mockResolvedValue({
          access_token: jwt.sign(mockUser, 'TP-GRUPO2-PROG-ADOPTAR', { expiresIn: '1h' }),
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/login (POST) - debería retornar un token JWT', async () => {
    const loginDto = { email: 'testuser@gmail.com', contrasenia: '123456' };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body).toHaveProperty('access_token');

    // Verificamos que el token sea válido y contenga el payload esperado
    const decoded = jwt.verify(response.body.access_token, 'TP-GRUPO2-PROG-ADOPTAR') as any;
    expect(decoded).toMatchObject(mockUser);
  });
});
