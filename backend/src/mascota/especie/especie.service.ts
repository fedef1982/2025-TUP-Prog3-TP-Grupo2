import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Especie } from './especie.model';


@Injectable()
export class EspecieService {
  constructor(
    @InjectModel(Especie)
    private readonly especieModel: typeof Especie,
  ) {}

  async findAll(): Promise<Especie[]> {
    return this.especieModel.findAll();
  }

  async validarEspecie(id: number): Promise<void> {
    const especie = await this.especieModel.findByPk(id);
    if (!especie) {
      throw new NotFoundException(`La especie con id ${id} no existe`);
    }
  }
}
