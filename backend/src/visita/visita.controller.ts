import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Post,
  Patch,
  Body,
} from '@nestjs/common';
import { VisitaService } from './visita.service';
import { Visita } from './visita.model';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import {
  DocDeleteIdVisita,
  DocGetIdVisita,
  DocGetVisita,
  DocPatchVisita,
  DocPostVisita,
} from './visita.doc';

@Controller('visita')
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  @DocGetVisita()
  @Get()
  findAll(): Promise<Visita[]> {
    return this.visitaService.findAll();
  }

  @DocGetIdVisita()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Visita> {
    return this.visitaService.findOne(id);
  }

  @DocPostVisita()
  @Post()
  create(@Body() createVisitaDto: CreateVisitaDto): Promise<Visita> {
    return this.visitaService.create(createVisitaDto);
  }

  @DocPatchVisita()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVisitaDto: UpdateVisitaDto,
  ): Promise<Visita> {
    return this.visitaService.update(id, updateVisitaDto);
  }

  @DocDeleteIdVisita()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.visitaService.remove(id);
  }
}
