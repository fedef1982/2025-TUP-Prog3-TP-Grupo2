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
import { UsersService } from './usuario.service';
import { User } from './usuario.model';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from '../../src/auth/decorators/public.decorator';
import { Roles } from '../../src/auth/decorators/roles.decorator';
import { Role } from '../../src/auth/roles.enum';
import { AuthenticatedRequest } from '../../src/auth/jwt-playload.interface';
import {
  DocDeleteIdUsuario,
  DocGetIdUsuario,
  DocGetUsuario,
  DocPatchUsuario,
  DocPostUsuario,
  DocGetUsuarioEstadisticas,
  DocGetUsuarioFiltros,
} from './usuario.doc';
import { EstadisticasUsuarioDto } from './dto/estadisticas-usuario.dto';
import { QueryOpcionesDto } from '../common/dto/query-opciones.dto';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @DocGetUsuario()
  @Get()
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @DocGetUsuarioFiltros()
  @Get(':id/filtros')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findUsuariosConFiltros(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Query() params: QueryOpcionesDto,
  ): Promise<{ users: User[]; total: number; totalPages: number }> {
    return this.usersService.findUsuariosConFiltros(id, req.user, params);
  }

  @DocPostUsuario()
  @Public()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<User> {
    return this.usersService.create(createUsuarioDto);
  }

  @DocGetIdUsuario()
  @Get(':id')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
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
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUsuarioDto: UpdateUsuarioDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.usersService.update(id, UpdateUsuarioDto, req.user);
  }

  @DocDeleteIdUsuario()
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.usersService.remove(id, req.user);
  }
}
