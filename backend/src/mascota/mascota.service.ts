import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Mascota } from './mascota.model';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { Especie } from './especie/especie.model';
import { Condicion } from './condicion/condicion.model';
import { User } from 'src/usuario/usuario.model';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { Role } from 'src/auth/roles.enum';
import { JwtPayload } from 'src/auth/jwt-playload.interface';
import { AccesoService } from 'src/acceso/acceso.service';
import { QueryOpcionesDto } from 'src/common/dto/query-opciones.dto';
import { Op } from 'sequelize';

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
    private readonly accesoService: AccesoService,
  ) {}

  public async validarMascota(id: number): Promise<Mascota> {
    const mascota = await this.mascotaModel.findByPk(id, {
      include: [Especie, Condicion, User],
    });
    if (!mascota) {
      throw new NotFoundException(`La mascota con ID ${id} no existe`);
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

  async findAll(usuarioId: number, usuario: JwtPayload): Promise<Mascota[]> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const where =
      usuario.rol_id === Number(Role.ADMIN) ? {} : { usuario_id: usuario.sub };
    return this.mascotaModel.findAll({
      where,
      include: [Especie, Condicion, User],
    });
  }

  async findOne(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Mascota> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const mascota = await this.validarMascota(id);
    this.accesoService.verificarAcceso(usuario, mascota);
    return mascota;
  }

  async create(
    dto: CreateMascotaDto,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Mascota> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    await this.validarEspecie(dto.especie_id);
    await this.validarCondicion(dto.condicion_id);

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
      usuario_id: usuario.sub,
    });
  }

  async update(
    id: number,
    dto: UpdateMascotaDto,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Mascota> {
    const mascota = await this.findOne(id, usuarioId, usuario);

    if (dto.especie_id && dto.especie_id !== mascota.especie_id) {
      await this.validarEspecie(dto.especie_id);
    }

    if (dto.condicion_id && dto.condicion_id !== mascota.condicion_id) {
      await this.validarCondicion(dto.condicion_id);
    }
    await mascota.update(dto);
    return mascota;
  }

  async remove(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<void> {
    const mascota = await this.findOne(id, usuarioId, usuario);
    await mascota.destroy();
  }

  async findMascotasConFiltros(
    usuarioId: number,
    usuario: JwtPayload,
    params: QueryOpcionesDto,
  ): Promise<{ mascotas: Mascota[]; total: number; totalPages: number }> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const {
      q,
      page = 1,
      limit = 10,
      sortBy = 'nombre',
      sortOrder = 'asc',
    } = params;
    const offset = (page - 1) * limit;

    const where =
      usuario.rol_id === Number(Role.ADMIN) ? {} : { usuario_id: usuario.sub };

    if (q) {
      where[Op.or] = [
        { raza: { [Op.iLike]: `%${q}%` } },
        { nombre: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const { count, rows } = await this.mascotaModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [Especie, Condicion, User],
    });

    return {
      mascotas: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }
}
