import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PublicacionesService } from './publicacion.service';
import { Publicacion } from './publicacion.model';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  create(
    @Body() createPublicacionDto: CreatePublicacionDto,
  ): Promise<Publicacion> {
    return this.publicacionesService.create(createPublicacionDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePublicacionDto: UpdatePublicacionDto,
  ): Promise<Publicacion> {
    return this.publicacionesService.update(id, updatePublicacionDto);
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
