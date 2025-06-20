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
import { MascotaService } from './mascota.service';
import { Mascota } from './mascota.model';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { AuthenticatedRequest } from '../auth/jwt-playload.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import {
  DocDeleteIdMascota,
  DocGetIdMascota,
  DocGetMascota,
  DocPatchMascota,
  DocPostMascota,
} from './mascota.doc';
import { AccesoService } from 'src/acceso/acceso.service';
import { QueryOpcionesDto } from 'src/common/dto/query-opciones.dto';

@Controller('usuarios/:usuarioId/mascotas')
export class MascotasController {
  constructor(
    private readonly mascotaService: MascotaService,
    private readonly accesoService: AccesoService,
  ) {}

  @DocGetMascota()
  @Get()
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findAll(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Mascota[]> {
    return this.mascotaService.findAll(usuarioId, req.user);
  }

  @Get('filtros')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findMascotasConFiltros(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
    @Query() params: QueryOpcionesDto,
  ): Promise<{ mascotas: Mascota[]; total: number; totalPages: number }> {
    return this.mascotaService.findMascotasConFiltros(
      usuarioId,
      req.user,
      params,
    );
  }

  @DocPostMascota()
  @Post()
  @Roles(Role.PUBLICADOR)
  create(
    @Body() createMascotaDto: CreateMascotaDto,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Mascota> {
    return this.mascotaService.create(createMascotaDto, usuarioId, req.user);
  }

  @DocGetIdMascota()
  @Get(':mascotaId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findOne(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('mascotaId', ParseIntPipe) mascotaId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Mascota> {
    return this.mascotaService.findOne(mascotaId, usuarioId, req.user);
  }

  @DocPatchMascota()
  @Patch(':mascotaId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  update(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('mascotaId', ParseIntPipe) mascotaId: number,
    @Body() updateMascotaDto: UpdateMascotaDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Mascota> {
    return this.mascotaService.update(
      mascotaId,
      updateMascotaDto,
      usuarioId,
      req.user,
    );
  }

  @DocDeleteIdMascota()
  @Delete(':mascotaId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  remove(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('mascotaId', ParseIntPipe) mascotaId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.mascotaService.remove(mascotaId, usuarioId, req.user);
  }
}
