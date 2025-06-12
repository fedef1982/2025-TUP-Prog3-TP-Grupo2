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
} from '@nestjs/common';
import { UsersService } from './usuario.service';
import { User } from './usuario.model';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { AuthenticatedRequest } from 'src/auth/jwt-playload.interface';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //Devuelve el perfil del usuario autenticado, cualquier usuario autenticado puede acceder a esta ruta (para que el ADMIN o un publicador pueda ver su propio perfil)
  @Get('perfil')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  getPerfil(@Req() req: AuthenticatedRequest) {
    const usuario = req.user;
    return this.usersService.findOne(usuario.sub);
  }

  @Public()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<User> {
    return this.usersService.create(createUsuarioDto);
  }

  //Devuelve el perfil del usuario con ID indicado, solo puede acceder el ADMIN (para que el admin pueda acceder al perfil de cualquier publicador)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUsuarioDto: UpdateUsuarioDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.usersService.update(id, UpdateUsuarioDto, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.usersService.remove(id, req.user);
  }
}
