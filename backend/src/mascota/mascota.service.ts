import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Mascota } from './mascota.model';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { Especie } from './especie.model';
import { Condicion } from './condicion.model';
import { User } from 'src/usuario/usuario.model';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { Role } from 'src/auth/roles.enum';
import { JwtPayload } from 'src/auth/jwt-playload.interface';

@Injectable()
export class MascotaService {
  constructor(
    @InjectModel(Mascota)
    private mascotaModel: typeof Mascota,

    @InjectModel(Especie)
    private especieModel: typeof Especie,

    @InjectModel(Condicion)
    private condicionModel: typeof Condicion,

    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(user: JwtPayload): Promise<Mascota[]> {
    const where =
      user.rol_id === Number(Role.ADMIN) ? {} : { usuario_id: user.sub };
    return this.mascotaModel.findAll({
      where,
      include: [Especie, Condicion, User],
    });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotaModel.findByPk(id, {
      include: [Especie, Condicion, User],
    });

    if (!mascota) {
      throw new NotFoundException(`La mascota con id ${id} no existe`);
    }
    return mascota;
  }

  private async validarEspecie(id: number): Promise<void> {
    const especie = await this.especieModel.findByPk(id);
    if (!especie) {
      throw new NotFoundException(`La especie con id ${id} no existe`);
    }
  }

  private async validarCondicion(id: number): Promise<void> {
    const condicion = await this.condicionModel.findByPk(id);
    if (!condicion) {
      throw new NotFoundException(`La condición con id ${id} no existe`);
    }
  }

  private async validarUsuario(id: number): Promise<void> {
    const usuario = await this.userModel.findByPk(id);
    if (!usuario) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }
  }

  async create(dto: CreateMascotaDto): Promise<Mascota> {
    await this.validarEspecie(dto.especie_id);
    await this.validarCondicion(dto.condicion_id);
    await this.validarUsuario(dto.usuario_id);

    return this.mascotaModel.create({
      nombre: dto.nombre,
      raza: dto.raza,
      sexo: dto.sexo,
      edad: dto.edad,
      vacunado: dto.vacunado,
      tamanio: dto.tamanio,
      fotos_url: dto.fotos_url,
      especie_id: dto.especie_id,
      condicion_id: dto.condicion_id,
      usuario_id: dto.usuario_id,
    });
  }

  async update(id: number, dto: UpdateMascotaDto): Promise<Mascota> {
    const mascota = await this.mascotaModel.findByPk(id);
    if (!mascota) {
      throw new NotFoundException(`La mascota con ID ${id} no existe`);
    }

    if (dto.especie_id && dto.especie_id !== mascota.especie_id) {
      await this.validarEspecie(dto.especie_id);
    }

    if (dto.condicion_id && dto.condicion_id !== mascota.condicion_id) {
      await this.validarCondicion(dto.condicion_id);
    }

    await mascota.update(dto);
    return mascota;
  }

  async remove(id: number): Promise<void> {
    const mascota = await this.findOne(id);
    await mascota.destroy();
  }
}
