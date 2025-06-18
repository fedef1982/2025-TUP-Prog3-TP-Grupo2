import { Injectable } from '@nestjs/common';
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
}
