import { AuthenticatedRequest } from '../../src/auth/jwt-playload.interface';
import { AuthGuard } from '../../src/auth/auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: MockProxy<Reflector>;
  let jwtService: MockProxy<JwtService>;
  let configService: MockProxy<ConfigService>;

  const createMockExecutionContext = (headers = {}) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = mock<Reflector>();
    jwtService = mock<JwtService>();
    configService = mock<ConfigService>();

    guard = new AuthGuard(jwtService, configService, reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería permitir acceso si el token es válido', async () => {
    const payload = { sub: 1, username: 'test@example.com', rol_id: 1 };
    reflector.getAllAndOverride.mockReturnValue(false);
    configService.get.mockReturnValue('fake-secret');
    jwtService.verifyAsync.mockResolvedValue(payload);

    const mockRequest: AuthenticatedRequest = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    } as AuthenticatedRequest;

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(payload);
  });

  it('debería lanzar UnauthorizedException si no hay token', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    const context = createMockExecutionContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('debería lanzar UnauthorizedException si el token es inválido', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    configService.get.mockReturnValue('fake-secret');
    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const context = createMockExecutionContext({
      authorization: 'Bearer invalid-token',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
