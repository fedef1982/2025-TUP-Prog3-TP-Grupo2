/* eslint-disable prettier/prettier */
import { 
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Post,
  Body,
  Req 
} from '@nestjs/common';
import { VisitaService } from './visita.service';
import { Visita } from './visita.model';
import { CreateVisitaDto } from './dto/create-visita.dto';

@Controller('visita')
export class VisitaController {

    constructor(private readonly visitaService: VisitaService) {}

      @Get()
      findAll(): Promise<Visita[]> {
        return this.visitaService.findAll();
      }
    
      @Get(':id')
      findOne(@Param('id', ParseIntPipe) id: number): Promise<Visita> {
        return this.visitaService.findOne(id);
      }
    
      @Post()
      create(@Body() createVisitaDto: CreateVisitaDto): Promise<Visita> {
        return this.visitaService.create(createVisitaDto);
      }
    /*
      @Patch(':id')
      update(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateUsuarioDto: UpdateUsuarioDto,
      ): Promise<Visita> {
        return this.visitaService.update(id, UpdateUsuarioDto);
      }
    */
     
     /* @Delete(':id')
      remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.visitaService.remove(id);
      }
       */ 
}