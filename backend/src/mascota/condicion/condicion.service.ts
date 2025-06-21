import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Condicion } from './condicion.model';

@Injectable()
export class CondicionService {
  constructor(
    @InjectModel(Condicion)
    private readonly condicionModel: typeof Condicion,
  ) {}

  async findAll(): Promise<Condicion[]> {
    return this.condicionModel.findAll();
  }

  async validarCondicion(id: number): Promise<void> {
    const condicion = await this.condicionModel.findByPk(id);
    if (!condicion) {
      throw new NotFoundException(`La condición con id ${id} no existe`);
    }
  }
}
