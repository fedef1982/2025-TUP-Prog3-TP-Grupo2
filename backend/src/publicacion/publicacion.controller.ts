import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { PublicacionesService } from './publicacion.service';
import { Publicacion } from './publicacion.model';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { AuthenticatedRequest } from '../auth/jwt-playload.interface';
import { Public } from '../auth/decorators/public.decorator';

import {
  DocDeleteIdPublicacion,
  DocGetIdPublicacion,
  DocGetPublicacion,
  DocPatchPublicacion,
  DocPostPublicacion,
} from './publicacion.doc';

@Controller()
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  //---------------Endpoints para los usuarios autenticados
  @DocGetIdPublicacion() //ver
  @Get('usuarios/:usuarioId/publicaciones')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findAll(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Publicacion[]> {
    return this.publicacionesService.findAll(usuarioId, req.user);
  }

  @DocPostPublicacion()
  @Post('usuarios/:usuarioId/publicaciones')
  @Roles(Role.PUBLICADOR)
  create(
    @Body() createPublicacionDto: CreatePublicacionDto,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Publicacion> {
    return this.publicacionesService.create(
      createPublicacionDto,
      usuarioId,
      req.user,
    );
  }

  @DocGetIdPublicacion() //ver
  @Get('usuarios/:usuarioId/publicaciones/:publicacionId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findOne(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('publicacionId', ParseIntPipe) publicacionId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Publicacion> {
    return this.publicacionesService.findOne(
      publicacionId,
      usuarioId,
      req.user,
    );
  }
  @DocPatchPublicacion()
  @Patch('usuarios/:usuarioId/publicaciones/:publicacionId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  update(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('publicacionId', ParseIntPipe) publicacionId: number,
    @Body() updatePublicacionDto: UpdatePublicacionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Publicacion> {
    return this.publicacionesService.update(
      publicacionId,
      updatePublicacionDto,
      usuarioId,
      req.user,
    );
  }

  @DocDeleteIdPublicacion()
  @Delete('usuarios/:usuarioId/publicaciones/:publicacionId')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  remove(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('publicacionId', ParseIntPipe) publicacionId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.publicacionesService.remove(publicacionId, usuarioId, req.user);
  }

  //---------------Endpoints para los usuarios no autenticados
  @DocGetPublicacion()
  @Public()
  @Get('publicaciones')
  findAllPublicadas(): Promise<Publicacion[]> {
    return this.publicacionesService.findPublicadasYAbiertas();
  }

  @DocGetIdPublicacion()
  @Public()
  @Get('publicaciones/:id')
  findOnePublicada(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Publicacion> {
    return this.publicacionesService.findOnePublicada(id);
  }
}
