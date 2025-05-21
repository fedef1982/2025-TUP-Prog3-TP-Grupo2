import { Controller, Get, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PublicacionesService } from './publicacion.service';
import { Publicacion } from './publicacion.model';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Get()
  findAll(): Promise<Publicacion[]> {
    return this.publicacionesService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Publicacion> {
    return this.publicacionesService.findOne(id);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.publicacionesService.remove(id);
  }
}
