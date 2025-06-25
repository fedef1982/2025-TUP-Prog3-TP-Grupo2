import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryOpcionesDto } from '../common/dto/query-opciones.dto';

export function DocPostUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear un usuario' }),
    ApiResponse({
      status: 409,
      description: `El email ingresado ya está registrado`,
    }),
    ApiBody({ type: CreateUsuarioDto }),
  );
}

export function DocPatchUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parámetros de un usuario' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiBody({ type: UpdateUsuarioDto }),
    ApiResponse({
      status: 404,
      description: `El usuario con id {id} no existe`,
    }),
    ApiResponse({
      status: 409,
      description: `El email ingresado ya está registrado`,
    }),
  );
}

export function DocGetUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todos los usuarios' }),
    ApiResponse({
      status: 403,
      description: `El rol de su usuario no tiene permisos para acceder a este recurso`,
    })
  );
}

export function DocGetIdUsuario() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar un usuario por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiResponse({
      status: 404,
      description: `El usuario con id {id} no existe`,
    }),
  );
}
// + de 1 posible mensaje de error 403...
export function DocGetIdPerfilUsuario() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve el perfil del usuario autenticado, cualquier usuario autenticado puede acceder a esta ruta (para que el ADMIN o un publicador pueda ver su propio perfil)',
    }),
    ApiParam({ name: 'id', type: Number, description: 'Perfil del usuario' }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a este recurso',
    }),
    ApiResponse({
      status: 404,
      description: `El usuario con id {id} no existe`,
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
    ApiResponse({
      status: 403,
      description: `El rol de su usuario no tiene permisos para acceder a este recurso`,
    })
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
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    })
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