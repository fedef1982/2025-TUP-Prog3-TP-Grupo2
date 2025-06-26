import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function DocGetEspecie() {
  return applyDecorators(
    ApiOperation({
      summary: 'Devuelve todas las especies existentes de las mascotas',
    }),
  );
}
