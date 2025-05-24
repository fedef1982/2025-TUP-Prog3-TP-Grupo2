import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Publicacion } from './publicacion.model';
//import { Mascota } from '../mascotas/mascota.model';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';

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

  async create(publicacionDto: CreatePublicacionDto): Promise<Publicacion> {
    // Verificar que la mascota existe
    /*const mascota = await this.mascotaModel.findOne({
      where: { id: createPublicacionDto.mascota_id },
      transaction,
    }) ;

    if (!mascota) {
      throw new NotFoundException(
        'Mascota no encontrada',
      );
    }*/

    return this.publicacionModel.create({
      titulo: publicacionDto.titulo,
      descripcion: publicacionDto.descripcion,
      ubicacion: publicacionDto.ubicacion,
      contacto: publicacionDto.contacto,
      mascota_id: publicacionDto.mascota_id,
      estado: 'Abierta' 
    } as any); 
  }

  async remove(id: number): Promise<void> {
    const publicacion = await this.findOne(id);
    await publicacion.destroy();
  }
}
