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
//import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PublicacionesService } from './publicacion.service';
import { Publicacion } from './publicacion.model';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

import {
  DocDeleteIdPublicacion,
  DocGetIdPublicacion,
  DocGetPublicacion,
  DocPatchPublicacion,
  DocPostPublicacion,
} from './publicacion.doc';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @DocPostPublicacion()
  @Post()
  create(
    @Body() createPublicacionDto: CreatePublicacionDto,
  ): Promise<Publicacion> {
    return this.publicacionesService.create(createPublicacionDto);
  }

  @DocPatchPublicacion()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePublicacionDto: UpdatePublicacionDto,
  ): Promise<Publicacion> {
    return this.publicacionesService.update(id, updatePublicacionDto);
  }

  @DocGetPublicacion()
  @Get()
  findAll(): Promise<Publicacion[]> {
    return this.publicacionesService.findAll();
  }

  @DocGetIdPublicacion()
  @Get(':id')
  findOne(id: number): Promise<Publicacion> {
    return this.publicacionesService.findOne(id);
  }

  @DocDeleteIdPublicacion()
  @Delete(':id')
  remove(id: number): Promise<void> {
    return this.publicacionesService.remove(id);
  }
}
