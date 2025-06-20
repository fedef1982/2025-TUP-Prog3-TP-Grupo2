import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam,ApiQuery } from '@nestjs/swagger';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { QueryOpcionesDto } from 'src/common/dto/query-opciones.dto';


export function DocPostVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear una visita' }),
    ApiResponse({ status: 201, description: 'Creada exitosamente' }),
    ApiResponse({ status: 400, description: 'Datos inválidos' }),
    ApiBody({ type: CreateVisitaDto }),
  );
}

export function DocGetVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todas las visitas' }),
    ApiResponse({
      status: 200,
      description: 'visitas obtenidas correctamente.',
    }),
  );
}

export function DocGetIdVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar visita por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la visita' }),
  );
}

export function DocPatchVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Modifica parámetros de una visita' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la visita' }),
    ApiBody({ type: UpdateVisitaDto }),
  );
}

export function DocDeleteIdVisita() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar visita por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la visita' }),
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
  );
}

export function DocGetVisitaFiltros(){
  return applyDecorators(
    ApiOperation({ summary: 'Devuelve un listado de visitas que cumplan con el criterio de la Query utilizada' }),
    ApiQuery({ type: QueryOpcionesDto }),
  );

}
