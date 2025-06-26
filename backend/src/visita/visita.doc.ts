import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';


export function DocPostVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear una visita' }),
    ApiResponse({
      status: 404,
      description: 'La publicacion con ID {id} no existe',
    }),
    ApiBody({ type: CreateVisitaDto }),
  );
}

export function DocGetVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todas las visitas' }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    }),
  );
}

export function DocGetIdVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar visita por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la visita' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario',
    }),
    ApiResponse({
      status: 404,
      description: 'La visita con ID {id} no existe',
    }),
  );
}

export function DocPatchVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parámetros de una visita' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la visita' }),
    ApiBody({ type: UpdateVisitaDto }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario / Estado inválido / Solo se pueden modificar visitas pendientes',
    }),
  );
}

export function DocDeleteIdVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar visita por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la visita' }),
    ApiResponse({
      status: 403,
      description:
        'No tiene permisos para acceder a este recurso / No tiene permisos para acceder a recursos de otro usuario'
    }),
  );
}

export function DocGetTrackingVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener el seguimiento de una visita' }),
    ApiParam({
      name: 'tracking',
      type: String,
      description: 'codigo tracking de la visita',
    }),
    ApiResponse({
      status: 404,
      description: 'Formulario de visita no encontrado',
    }),
  );
}

export function DocGetVisitaFiltros(){
  return applyDecorators(
    ApiOperation({
      summary:
        'Devuelve un listado de visitas que cumplan con el criterio de la Query utilizada',
    }),
    ApiQuery({ type: QueryOpcionesDto }),
    ApiResponse({
      status: 403,
      description: 'No tiene permisos para acceder a recursos de otro usuario',
    }),
  );

}
