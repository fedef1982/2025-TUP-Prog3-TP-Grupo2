import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';

export function DocPostMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear una mascota' }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description:
        'La condición con id {id} no existe / La especie con id {id} no existe',
    }),
    ApiBody({ type: CreateMascotaDto }),
  );
}

export function DocPatchMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parámetros de una mascota' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' }),
    ApiBody({ type: UpdateMascotaDto }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description:
        'La mascota con ID {id} no existe / La condición con id {id} no existe / La especie con id {id} no existe',
    }),
  );
}

export function DocGetMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todas las mascotas' }),
  );
}

export function DocGetIdMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar mascota por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description: ' La mascota con ID {id} no existe',
    }),
  );
}

export function DocDeleteIdMascota() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar mascota por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description: ' La mascota con ID {id} no existe',
    }),
  );
}

export function DocGetMascotaFiltros(){
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve un listado de mascotas que cumplan con el criterio de la Query utilizada',
    }),
    ApiQuery({ type: QueryOpcionesDto }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    }),
  );
}
