import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function DocGetCondicion() {
  return applyDecorators(
    ApiOperation({ summary: 'Devuelve todas las condiciones posibles de una mascota' }),
  );
}
