import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Post,
  Patch,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import { VisitaService } from './visita.service';
import { Visita } from './visita.model';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import {
  DocDeleteIdVisita,
  DocGetIdVisita,
  DocGetTrackingVisita,
  DocGetVisita,
  DocPatchVisita,
  DocPostVisita,
} from './visita.doc';
import { Role } from '../auth/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedRequest } from '../auth/jwt-playload.interface';
import { Public } from '../auth/decorators/public.decorator';
import { TrackingVisita } from './dto/tracking-visita.dto';
import { QueryOpcionesDto } from 'src/common/dto/query-opciones.dto';

@Controller()
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  //---------------Endpoints para los usuarios autenticados
  @DocGetVisita()
  @Get('usuarios/:usuarioId/visitas')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findAll(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Visita[]> {
    return this.visitaService.findAll(usuarioId, req.user);
  }

  @Get('usuarios/:usuarioId/visitas/filtros')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findVisitasConFiltros(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
    @Query() params: QueryOpcionesDto,
  ): Promise<{
    visitas: Visita[];
    total: number;
    totalPages: number;
  }> {
    return this.visitaService.findVisitasConFiltros(
      usuarioId,
      req.user,
      params,
    );
  }

  @DocGetIdVisita()
  @Get('usuarios/:usuarioId/visitas/:visitaId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findOne(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('visitaId', ParseIntPipe) visitaId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Visita> {
    return this.visitaService.findOne(visitaId, usuarioId, req.user);
  }

  @DocPatchVisita()
  @Patch('usuarios/:usuarioId/visitas/:visitaId')
  update(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('visitaId', ParseIntPipe) visitaId: number,
    @Body() updateVisitaDto: UpdateVisitaDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Visita> {
    return this.visitaService.update(
      visitaId,
      updateVisitaDto,
      usuarioId,
      req.user,
    );
  }

  @DocDeleteIdVisita()
  @Delete('usuarios/:usuarioId/visitas/:visitaId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  remove(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('visitaId', ParseIntPipe) visitaId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.visitaService.remove(visitaId, usuarioId, req.user);
  }

  //---------------Endpoints para los usuarios no autenticados

  @DocPostVisita()
  @Public()
  @Post('publicaciones/:publicacionId/visitas')
  create(
    @Body() createVisitaDto: CreateVisitaDto,
    @Param('publicacionId', ParseIntPipe) publicacionId: number,
  ): Promise<Visita> {
    return this.visitaService.create(createVisitaDto, publicacionId);
  }

  @DocGetTrackingVisita()
  @Public()
  @Get('visitas/seguimiento/:tracking')
  getEstado(@Param('tracking') tracking: string): Promise<TrackingVisita> {
    return this.visitaService.getTracking(tracking);
  }
}
