import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Publicacion } from './publicacion.model';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion)
    private publicacionModel: typeof Publicacion,
  ) {}

  async findAll(): Promise<Publicacion[]> {
    return this.publicacionModel.findAll();
  }

  async findOne(id: number): Promise<Publicacion> {
    const publicacion = await this.publicacionModel.findByPk(id);
    if (!publicacion) {
      throw new NotFoundException(`La publicacion con id ${id} no existe`);
    }
    return publicacion;
  }

  async remove(id: number): Promise<void> {
    const publicacion = await this.findOne(id);
    await publicacion.destroy();
  }
}
