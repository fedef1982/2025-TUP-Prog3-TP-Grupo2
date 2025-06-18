import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

export function DocPostMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear una mascota' }),
    ApiResponse({ status: 201, description: 'Creada exitosamente' }),
    ApiResponse({ status: 400, description: 'Datos inválidos' }),
    ApiBody({ type: CreateMascotaDto }),
  );
}

export function DocPatchMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parámetros de una mascota' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' }),
    ApiBody({ type: UpdateMascotaDto }),
  );
}

export function DocGetMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todas las mascotas' }),
    ApiResponse({
      status: 200,
      description: 'Mascotas obtenidas correctamente.',
    }),
  );
}

export function DocGetIdMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar mascota por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' }),
  );
}

export function DocDeleteIdMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar mascota por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' }),
  );
}
