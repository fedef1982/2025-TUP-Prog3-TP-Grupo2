import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Body,
  Post,
  Patch,
  Req,
  Query,
} from '@nestjs/common';
import { DonacionService } from './donacion.service';
import { Donacion } from './donacion.model';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';
import { AuthenticatedRequest } from '../../src/auth/jwt-playload.interface';
import { Roles } from '../../src/auth/decorators/roles.decorator';
import { Role } from '../../src/auth/roles.enum';
import { AccesoService } from '../../src/acceso/acceso.service';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class DonacionController {
  constructor(
    private readonly donacionService: DonacionService,
    private readonly accesoService: AccesoService,
  ) {}

  //---------------Endpoints para los usuarios autenticados
  @Get('usuarios/:usuarioId/donaciones')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findAll(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Donacion[]> {
    return this.donacionService.findAll(usuarioId, req.user);
  }

  @Get('usuarios/:usuarioId/donaciones/filtros')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findDonacionesConFiltros(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
    @Query() params: QueryOpcionesDto,
  ): Promise<{
    donaciones: Donacion[];
    total: number;
    totalPages: number;
  }> {
    return this.donacionService.findDonacionesConFiltros(
      usuarioId,
      req.user,
      params,
    );
  }

  @Post('usuarios/:usuarioId/donaciones')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  create(
    @Body() createDonacionDto: CreateDonacionDto,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Donacion> {
    return this.donacionService.create(createDonacionDto, usuarioId, req.user);
  }

  @Get('usuarios/:usuarioId/donaciones/:donacionId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findOne(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('donacionId', ParseIntPipe) donacionId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Donacion> {
    return this.donacionService.findOne(donacionId, usuarioId, req.user);
  }

  @Patch('usuarios/:usuarioId/donaciones/:donacionId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  update(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('donacionId', ParseIntPipe) donacionId: number,
    @Body() updateDonacionDto: UpdateDonacionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Donacion> {
    return this.donacionService.update(
      donacionId,
      updateDonacionDto,
      usuarioId,
      req.user,
    );
  }

  @Delete('usuarios/:usuarioId/donaciones/:donacionId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  remove(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('donacionId', ParseIntPipe) donacionId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.donacionService.remove(donacionId, usuarioId, req.user);
  }

  //---------------Endpoints para los usuarios no autenticados
  @Public()
  @Get('publicaciones/:publicacionId/donaciones/:id')
  findOnePublica(@Param('id', ParseIntPipe) id: number): Promise<Donacion> {
    return this.donacionService.findOnePublica(id);
  }
}
