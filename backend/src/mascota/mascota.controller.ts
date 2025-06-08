import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Body,
  Post,
  Patch,
  Request,
} from '@nestjs/common';
import { MascotaService } from './mascota.service';
import { Mascota } from './mascota.model';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { AuthenticatedRequest } from 'src/auth/jwt-playload.interface';

@Controller('user/:id/mascotas')
export class MascotasController {
  constructor(private readonly mascotaService: MascotaService) {}

  @Get()
  findAll(@Request() req: AuthenticatedRequest): Promise<Mascota[]> {
    return this.mascotaService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Mascota> {
    return this.mascotaService.findOne(id);
  }

  @Post()
  create(@Body() createMascotaDto: CreateMascotaDto): Promise<Mascota> {
    return this.mascotaService.create(createMascotaDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMascotaDto: UpdateMascotaDto,
  ): Promise<Mascota> {
    return this.mascotaService.update(id, updateMascotaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mascotaService.remove(id);
  }
}
