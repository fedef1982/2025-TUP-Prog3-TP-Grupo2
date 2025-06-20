import { Injectable } from '@nestjs/common';
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
}
