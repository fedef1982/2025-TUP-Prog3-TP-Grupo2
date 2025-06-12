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
import { MascotaService } from './mascota.service';
import { Mascota } from './mascota.model';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { AuthenticatedRequest } from 'src/auth/jwt-playload.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@Controller('usuarios/:id/mascotas')
export class MascotasController {
  constructor(private readonly mascotaService: MascotaService) {}

  @Get()
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findAll(@Req() req: AuthenticatedRequest): Promise<Mascota[]> {
    return this.mascotaService.findAll(req.user);
  }

  @Post()
  @Roles(Role.PUBLICADOR)
  create(
    @Body() createMascotaDto: CreateMascotaDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Mascota> {
    return this.mascotaService.create(createMascotaDto, req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Mascota> {
    return this.mascotaService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMascotaDto: UpdateMascotaDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Mascota> {
    return this.mascotaService.update(id, updateMascotaDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.mascotaService.remove(id, req.user);
  }
}
