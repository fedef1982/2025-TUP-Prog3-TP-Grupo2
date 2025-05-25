/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Visita } from './visita.model';
//import { CreateVisitaDto } from './dto/create-usuario.dto';
//import { UpdateVisitaDto } from './dto/update-usuario.dto';

@Injectable()
export class VisitaService {
  constructor(
    @InjectModel(Visita)
    private visitaModel: typeof Visita,
  ) {}

async findAll(): Promise<Visita[]> {
    return this.visitaModel.findAll();
  }

async findOne(id: number): Promise<User> {
    const visita = await this.visitaModel.findByPk(id);
    if (!visita) {
      throw new NotFoundException(`La visita con id ${id} no existe`);
    }
    return visita;
  }
/*
  async create(/*dto: CreateVisitaDto/): Promise<Visita> {}

  async update(/*id: number, dto: UpdateVisitaDto/): Promise<Visita> {}

  async remove(id: number): Promise<void> {}
  */
}