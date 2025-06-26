import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

export function DocPostLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Loguear un usuario' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
      status: 401,
      description: 'Credenciales inválidas',
    }),
  );
}

/*export function DocGetProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Devolver los datos del perfil de un usuario' }),
  );
}*/