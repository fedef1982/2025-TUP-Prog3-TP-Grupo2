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

describe('/auth/login (POST)', () => {
  let app: INestApplication;
  let authService: AuthService;
  // Mock user payload que simula el JWT payload
  const mockUser = {
    id: 1,
    email: 'testuser@gmail.com',
    nombre: 'Test User',
    rol: 'admin',
  };
  // Debe coincidir con la clave usada en el módulo JWT
  const jwtSecret = 'TP-GRUPO2-PROG-ADOPTAR'; 

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          // Usamos memoria dinámica para test, para evitar archivos físicos
          storage: ':memory:', 
          autoLoadModels: true,
          synchronize: true,
          logging: false,
        }),
        AuthModule
      ],
    })
      .overrideProvider(AuthService)
      .useValue({
        // Mock del método login que retorna un token JWT firmado con mockUser
        login: jest.fn().mockImplementation(async () => {
          return {
            access_token: jwt.sign(mockUser, jwtSecret),
          };
        }),
        // Podemos mockear aquí otros métodos si es necesario
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('debería retornar un token JWT', async () => {
    const loginDto = { email: 'testuser@gmail.com', contrasenia: '123456' };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body).toHaveProperty('access_token');

    // Verificamos que el token sea válido y contenga el payload esperado (mockUser)
    const decoded = jwt.verify(response.body.access_token, jwtSecret);
    expect(decoded).toMatchObject(mockUser);

    // Verificamos que el método login fue llamado con los datos correctos
    //expect(authService.login).toHaveBeenCalledWith(loginDto);
  });
});

/* const mockUser = {
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
}); */
