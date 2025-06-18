import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

export function DocPostPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear una publicación' }),
    ApiResponse({ status: 201, description: 'Creada exitosamente' }),
    ApiResponse({ status: 400, description: 'Datos inválidos' }),
    ApiBody({ type: CreatePublicacionDto }),
  );
}

export function DocPatchPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parametros de una publicación' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la publicación' }),
    ApiBody({ type: UpdatePublicacionDto }),
  );
}

export function DocGetPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todas las publicaciones' }),
    ApiResponse({
      status: 200,
      description: 'Publicaciones obtenidas correctamente.',
    }),
  );
}

export function DocGetIdPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar publicacion por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la publicación' }),
  );
}

export function DocDeleteIdPublicacion() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar publicacion por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la publicación' }),
  );
}
