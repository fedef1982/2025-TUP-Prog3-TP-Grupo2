import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { LoginDto } from '../../src/auth/dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('Debería devolver un access_token si las credenciales son válidas', async () => {
      const dto: LoginDto = {
        email: 'test@gmail.com',
        contrasenia: 'password123',
      };

      const token = { access_token: 'fake-jwt-token' };
      mockAuthService.signIn.mockResolvedValue(token);

      const result = await controller.signIn(dto);
      expect(result).toEqual(token);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        dto.email,
        dto.contrasenia,
      );
    });
  });
});
