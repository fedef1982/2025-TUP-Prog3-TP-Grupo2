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

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //Devuelve el perfil del usuario autenticado, cualquier usuario autenticado puede acceder a esta ruta (para que el ADMIN o un publicador pueda ver su propio perfil)
  @Get(':usuarioId/perfil')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  getPerfil(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.findOne(usuarioId, req.user);
  }

  @Public()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<User> {
    return this.usersService.create(createUsuarioDto);
  }

  //Devuelve el perfil del usuario con ID indicado, solo puede acceder el ADMIN (para que el admin pueda acceder al perfil de cualquier publicador)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.usersService.findOne(id, req.user);
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

/// endpoints paginado y filters
@Get('paginas')
  @Roles(Role.ADMIN)
  async getTotalPages(
    @Query('query') query: string = '',
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10
  ): Promise<{ totalPages: number }> {
    console.log('###########################################');
    console.log('Received params:', { query, limit }); 
    console.log('###########################################');
    const totalPages = await this.usersService.getTotalPages(query, limit);
    return { totalPages };
  }

  @Get(':id/paginas')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  async getUserPages(
    @Param('id', ParseIntPipe) id: number,
    @Query('query') query: string = '',
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Req() req: AuthenticatedRequest
  ): Promise<{ totalPages: number }> {
    console.log('###########################################');
    console.log('Received params:', { id, query, limit }); 
    console.log('###########################################');
    const totalPages = await this.usersService.getTotalPages(query, limit, id, req.user);
    return { totalPages };
  }

  @Get('filtros')
  @Roles(Role.ADMIN,)
  async getFilteredUsers(
    @Query('q') query: string = '',
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('rol_id', new ParseIntPipe({ optional: true })) rol_id?: number,
    @Query('sortBy') sortBy: string = 'nombre',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<{ users: User[]; total: number }> {
    console.log('###########################################');
    console.log('Received params:', { page, limit, rol_id }); 
    console.log('###########################################');
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      throw new BadRequestException('sortOrder must be either "asc" or "desc"');
    }
    return this.usersService.getFilteredUsers({
      query,
      page,
      limit,
      rol_id,
      sortBy,
      sortOrder
    });
  }
}