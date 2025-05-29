import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EstadoPublicacion, Publicacion } from './publicacion.model';
import { Mascota } from '../mascota/mascota.model';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion)
    private publicacionModel: typeof Publicacion,

    @InjectModel(Mascota)
    private mascotaModel: typeof Mascota,
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

  async create(publicacionDto: CreatePublicacionDto): Promise<Publicacion> {
    const mascota = await this.mascotaModel.findByPk(publicacionDto.mascota_id);

    if (!mascota) {
      throw new NotFoundException('Mascota no encontrada');
    }

    return this.publicacionModel.create({
      titulo: publicacionDto.titulo,
      descripcion: publicacionDto.descripcion,
      ubicacion: publicacionDto.ubicacion,
      contacto: publicacionDto.contacto,
      mascota_id: publicacionDto.mascota_id,
      estado: EstadoPublicacion.Abierta,
    });
  }

  async remove(id: number): Promise<void> {
    const publicacion = await this.findOne(id);
    await publicacion.destroy();
  }

  async update(id: number, dto: CreatePublicacionDto): Promise<Publicacion> {
    const visita = await this.findOne(id);
    await visita.update(dto);
    return visita;
  }
}
