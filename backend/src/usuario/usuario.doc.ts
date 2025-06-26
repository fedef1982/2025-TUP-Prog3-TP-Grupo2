import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  //ApiRequest,
} from '@nestjs/swagger';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryOpcionesDto } from '../common/dto/query-opciones.dto';

export function DocPostUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear un usuario' }),
    ApiResponse({ status: 201, description: 'Creado exitosamente' }),
    ApiResponse({ status: 400, description: 'Datos inválidos' }),
    ApiBody({ type: CreateUsuarioDto }),
  );
}

export function DocPatchUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parámetros de un usuario' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiBody({ type: UpdateUsuarioDto }),
    //ApiReqest({}),
  );
}

export function DocGetUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todos los usuarios' }),
    ApiResponse({
      status: 200,
      description: 'Usuarios obtenidos correctamente.',
    }),
  );
}

export function DocGetIdUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar un usuario por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiResponse({
      status: 200,
      description: 'Usuario obtenido correctamente.',
    }),
  );
}

export function DocDeleteIdUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar usuario por ID' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'ID de la publicación',
    }),
  );
}

export function DocGetUsuarioEstadisticas() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve la cantidad total de usuarios, mascotas, publicaciones y visitas que le pertenecen a un usuario. Si el usuario es un publicador, la cantidad de usuarios siempre es 1.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'ID del usuario',
    }),
  );
}

export function DocGetUsuarioFiltros(){
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve un listado de usuarios que cumplan con el criterio de la Query utilizada',
    }),
    ApiQuery({ type: QueryOpcionesDto }),
  );
}
