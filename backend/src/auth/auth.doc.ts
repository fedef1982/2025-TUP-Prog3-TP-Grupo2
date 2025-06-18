import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

export function DocPostLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Loguear un usuario' }),
    ApiBody({ type: LoginDto }),
  );
}

export function DocGetProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Devolver los datos del perfil de un usuario' }),
  );
}