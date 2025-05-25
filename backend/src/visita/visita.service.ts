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
    /*return this.userModel.create({
      email: dto.email,
      nombre: dto.nombre,
      apellido: dto.apellido,
      contrasenia: dto.contrasenia,
      rol: 'Publicador',
      telefono: dto.telefono,
      direccion: dto.direccion,
    });*/
  }
    
/*
async update(/*id: number, dto: UpdateVisitaDto/): Promise<Visita> {

    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      await this.validarEmailUnico(dto.email);
    }

    await user.update(dto);
    return user;

}
*/
  async remove(id: number): Promise<void> {
      const visita = await this.findOne(id);
      await visita.destroy();
  }
  
}