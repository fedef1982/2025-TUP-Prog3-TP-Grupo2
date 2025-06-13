import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  //ApiRequest,
} from '@nestjs/swagger';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

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
    ApiOperation({ summary: 'Modifica parametros de un usuario' }),
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
      description: 'usuario obtenido correctamente.',
    }),
  );
}

export function DocGetIPerfilUsuario() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve el perfil del usuario autenticado, cualquier usuario autenticado puede acceder a esta ruta (para que el ADMIN o un publicador pueda ver su propio perfil)',
    }),
    ApiParam({ name: 'id', type: Number, description: 'perfil del usuario' }),
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
