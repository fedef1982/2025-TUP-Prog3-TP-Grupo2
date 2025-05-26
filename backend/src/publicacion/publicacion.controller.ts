import { Controller, Get, Delete, Post, Body } from '@nestjs/common';
import { PublicacionesService } from './publicacion.service';
import { Publicacion } from './publicacion.model';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  create(
    @Body() createPublicacionDto: CreatePublicacionDto,
  ): Promise<Publicacion> {
    return this.publicacionesService.create(createPublicacionDto);
  }

  @Get()
  findAll(): Promise<Publicacion[]> {
    return this.publicacionesService.findAll();
  }

  @Get(':id')
  findOne(id: number): Promise<Publicacion> {
    return this.publicacionesService.findOne(id);
  }

  @Delete(':id')
  remove(id: number): Promise<void> {
    return this.publicacionesService.remove(id);
  }
}
