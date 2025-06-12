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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { AuthenticatedRequest } from 'src/auth/jwt-playload.interface';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller()
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  //---------------Endpoints para los usuarios autenticados

  @Get('usuarios/:usuarioId/publicaciones')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findAll(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Publicacion[]> {
    return this.publicacionesService.findAll(usuarioId, req.user);
  }

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

  @Public()
  @Get('publicaciones')
  findAllPublicas(): Promise<Publicacion[]> {
    return this.publicacionesService.findPublicadasYAbiertas();
  }

  @Public()
  @Get('publicaciones/:id')
  findOnePublica(@Param('id', ParseIntPipe) id: number): Promise<Publicacion> {
    return this.publicacionesService.findOnePublica(id);
  }
}
