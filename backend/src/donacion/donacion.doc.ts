import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';

export function DocPostDonacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear una donación' }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description: 'El usuario con id {id} no existe',
    }),
    ApiBody({ type: CreateDonacionDto }),
  );
}

export function DocPatchDonacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parámetros de una donación' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la donación' }),
    ApiBody({ type: UpdateDonacionDto }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description:
        'La donación con ID {id} no existe / El usuario con id {id} no existe',
    }),
  );
}

export function DocGetDonacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todas las donaciones' }),
  );
}

export function DocGetIdDonacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar donación por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la donación' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description: ' La donación con ID {id} no existe',
    }),
  );
}

export function DocGetDonacionPublica() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar datos de donación por el usuario ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiResponse({
      status: 404,
      description: 'El usuario con ID {id} no existe',
    }),
  );
}

export function DocDeleteIdDonacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar donación por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la donación' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description: ' La donación con ID {id} no existe',
    }),
  );
}

export function DocGetDonacionFiltros() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve un listado de donaciones que cumplan con el criterio de la Query utilizada',
    }),
    ApiQuery({ type: QueryOpcionesDto }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    }),
  );
}
