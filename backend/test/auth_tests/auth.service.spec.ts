import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { mock } from 'jest-mock-extended';
import { User } from '../../src/usuario/usuario.model';

describe('AuthService', () => {
  let service: AuthService;
  const mockedUsersService = mock<UsersService>();
  const mockedJwtService = mock<JwtService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockedUsersService },
        { provide: JwtService, useValue: mockedJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Debería retornar un token si el login es exitoso', async () => {
    const mockUser = {
      id: 1,
      email: 'test@gmail.com',
      contrasenia: await bcrypt.hash('password123', 10),
      rol_id: 2,
    } as User;

    mockedUsersService.findByEmail.mockResolvedValue(mockUser);
    mockedJwtService.signAsync.mockResolvedValue('mocked-token');

    const result = await service.signIn('test@gmail.com', 'password123');

    expect(result.access_token).toBe('mocked-token');
  });

  it('Debería lanzar UnauthorizedException si el email no existe', async () => {
    mockedUsersService.findByEmail.mockResolvedValue(null);

    await expect(service.signIn('noexiste@gmail.com', '123')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('Debería lanzar UnauthorizedException si la contraseña es inválida', async () => {
    const mockUser = {
      id: 1,
      email: 'test@gmail.com',
      contrasenia: await bcrypt.hash('otraClave', 10),
      rol_id: 2,
    } as User;

    mockedUsersService.findByEmail.mockResolvedValue(mockUser);

    await expect(
      service.signIn('test@gmail.com', 'claveIncorrecta'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
