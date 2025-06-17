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
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './usuario.service';
import { User } from './usuario.model';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { AuthenticatedRequest } from 'src/auth/jwt-playload.interface';
import {
  DocDeleteIdUsuario,
  DocGetIdUsuario,
  DocGetIdPerfilUsuario,
  DocGetUsuario,
  DocPatchUsuario,
  DocPostUsuario,
  DocGetUsuarioEstadisticas,
} from './usuario.doc';
import { EstadisticasUsuarioDto } from './dto/estadisticas-usuario.dto';
import { QueryUsuariosDto } from './dto/query-usuario.dto';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @DocGetUsuario()
  @Get()
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id/filtros')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findUsuariosConFiltros(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Query() params: QueryUsuariosDto,
  ): Promise<{ users: User[]; total: number }> {
    return this.usersService.findUsuariosConFiltros(id, req.user, params);
  }

  //Devuelve el perfil del usuario autenticado, cualquier usuario autenticado puede acceder a esta ruta (para que el ADMIN o un publicador pueda ver su propio perfil)
  @DocGetIdPerfilUsuario()
  @Get(':id/perfil')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  getPerfil(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.findOne(id, req.user);
  }

  @DocPostUsuario()
  @Public()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<User> {
    return this.usersService.create(createUsuarioDto);
  }

  //Devuelve el perfil del usuario con ID indicado, solo puede acceder el ADMIN (para que el admin pueda acceder al perfil de cualquier publicador)
  @DocGetIdUsuario()
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.usersService.findOne(id, req.user);
  }

  @DocGetUsuarioEstadisticas()
  @Get(':id/estadisticas')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  getEstadisticas(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<EstadisticasUsuarioDto> {
    return this.usersService.getEstadisticas(id, req.user);
  }

  @DocPatchUsuario()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUsuarioDto: UpdateUsuarioDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.usersService.update(id, UpdateUsuarioDto, req.user);
  }

  @DocDeleteIdUsuario()
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.usersService.remove(id, req.user);
  }
}