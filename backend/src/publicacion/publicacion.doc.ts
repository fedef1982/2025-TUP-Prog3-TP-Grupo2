import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';

export function DocPostPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear una publicación' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a recursos de otro usuario / No tiene permisos para acceder a este recurso',
    }),
    ApiResponse({
      status: 404,
      description: 'La mascota con ID ${id} no existe',
    }),
    ApiBody({ type: CreatePublicacionDto }),
  );
}

export function DocPatchPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parámetros de una publicación' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la publicación' }),
    ApiBody({ type: UpdatePublicacionDto }),
    ApiResponse({
      status: 403,
      description:
        'Solo el admin puede publicar publicaciones / Solo se pueden publicar publicaciones que estén en estado Abierta / Solo se pueden editar publicaciones que estén en estado Abierta',
    }),
  );
}

export function DocGetPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todas las publicaciones' }),
  );
}

export function DocGetIdPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar publicación por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la publicación' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a recursos de otro usuario / No tiene permisos para acceder a este recurso',
    }),
    ApiResponse({
      status: 404,
      description: 'La publicacion con ID {id} no existe ',
    }),
  );
}

export function DocDeleteIdPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar publicación por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la publicación' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a recursos de otro usuario / No tiene permisos para acceder a este recurso',
    }),
    ApiResponse({
      status: 404,
      description: 'La publicacion con ID {id} no existe ',
    }),
  );
}

export function DocGetPublicacionFiltros() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve un listado de publicaciones que cumplan con el criterio de la Query utilizada',
    }),
    ApiQuery({ type: QueryOpcionesDto }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    }),
  );
}

export function DocGetPublicacionAbiertaConFiltro() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve un listado de publicaciones abiertas y publicadas que cumplan con el criterio de la Query utilizada',
    }),
    ApiQuery({ type: QueryOpcionesDto }),
    ApiResponse({
      status: 404,
      description:
        'No se encontró una publicación abierta y publicada con ID {id} ',
    }),
  );
}
