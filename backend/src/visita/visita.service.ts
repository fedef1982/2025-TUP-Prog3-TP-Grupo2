/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Visita } from './visita.model';
import { CreateVisitaDto } from './dto/create-visita.dto';
//import { UpdateVisitaDto } from './dto/update-visita.dto';

@Injectable()
export class VisitaService {
  constructor(
    @InjectModel(Visita)
    private visitaModel: typeof Visita,
  ) {}

async findAll(): Promise<Visita[]> {
    return this.visitaModel.findAll();
  }

async findOne(id: number): Promise<Visita> {
    const visita = await this.visitaModel.findByPk(id);
    if (!visita) {
      throw new NotFoundException(`La visita con id ${id} no existe`);
    }
    return visita;
  }

  async create(dto: CreateVisitaDto): Promise<Visita> {
    return this.visitaModel.create({
      
      nombre: dto.nombre,
      apellido: dto.apellido,
      telefono: dto.telefono,
      //direccion: dto.direccion,
      email: dto.email,
      disponibilidad_fecha: dto.disponibilidad_fecha,
    //disponibilidad_horaria: dto.disponibilidad_horaria,
      descripcion: dto.descripcion,
    });
  }
    
/*
async update(/*id: number, dto: UpdateVisitaDto/): Promise<Visita> {

    const visita = await this.findOne(id);
    
    await visita.update(dto);
    return visita;

}
*/
  async remove(id: number): Promise<void> {
      const visita = await this.findOne(id);
      await visita.destroy();
  }
  
}