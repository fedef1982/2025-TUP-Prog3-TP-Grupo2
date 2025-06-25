import { RolesGuard } from '../../src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Role } from '../../src/auth/roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector: Reflector;

  const mockExecutionContext = (user: any) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    guard = new RolesGuard(mockReflector);
  });

  it('debería permitir acceso si no hay roles requeridos', () => {
    jest.spyOn(mockReflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = mockExecutionContext(undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debería lanzar UnauthorizedException si no hay usuario', () => {
    jest
      .spyOn(mockReflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN]);

    const context = mockExecutionContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('debería lanzar ForbiddenException si el usuario no tiene rol permitido', () => {
    jest
      .spyOn(mockReflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN]);

    const context = mockExecutionContext({ rol_id: Role.PUBLICADOR });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('debería permitir acceso si el usuario tiene un rol permitido', () => {
    jest
      .spyOn(mockReflector, 'getAllAndOverride')
      .mockReturnValue([Role.PUBLICADOR]);

    const context = mockExecutionContext({ rol_id: Role.PUBLICADOR });

    expect(guard.canActivate(context)).toBe(true);
  });
});
