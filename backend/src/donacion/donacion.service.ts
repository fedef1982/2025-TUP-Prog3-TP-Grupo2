import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../src/usuario/usuario.model';
import { JwtPayload } from '../../src/auth/jwt-playload.interface';
import { AccesoService } from '../../src/acceso/acceso.service';
import { QueryOpcionesDto } from '../common/dto/query-opciones.dto';
import { Op } from 'sequelize';
import { Donacion } from './donacion.model';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';
import { Role } from '../auth/roles.enum';

@Injectable()
export class DonacionService {
  constructor(
    @InjectModel(Donacion) private readonly donacionModel: typeof Donacion,
    @InjectModel(User) private userModel: typeof User,
    private readonly accesoService: AccesoService,
  ) {}

  async findAll(usuarioId: number, usuario: JwtPayload): Promise<Donacion[]> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const where =
      usuario.rol_id === Number(Role.ADMIN) ? {} : { usuario_id: usuario.sub };
    return this.donacionModel.findAll({
      where,
      include: [User],
    });
  }

  public async validarDonacion(id: number): Promise<Donacion> {
    const donacion = await this.donacionModel.findByPk(id, {
      include: [User],
    });
    if (!donacion) {
      throw new NotFoundException(`La donacion con ID ${id} no existe`);
    }
    return donacion;
  }

  async findOneByUser(usuarioId: number): Promise<Donacion> {
    const where = { usuario_id: usuarioId };
    const donacion = await this.donacionModel.findAll({ where });
    if (!donacion) {
      throw new NotFoundException(
        `La donacion con usuario ID ${usuarioId} no existe`,
      );
    }
    return donacion[0];
  }

  async findOne(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Donacion> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const donacion = await this.validarDonacion(id);
    this.accesoService.verificarAcceso(usuario, donacion);
    return donacion;
  }

  async findOnePublica(id: number): Promise<Donacion> {
    const donacion = await this.validarDonacion(id);
    return donacion;
  }

  async create(
    dto: CreateDonacionDto,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Donacion> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);

    return this.donacionModel.create({
      destinatario: dto.destinatario,
      cbu: dto.cbu,
      cuit: dto.cuit,
      entidad_financiera: dto.entidad_financiera,
      tipo_cuenta: dto.tipo_cuenta,
      alias: dto.alias,
      link_pago: dto.link_pago,
      motivo_donacion: dto.motivo_donacion,
      usuario_id: usuario.sub,
    });
  }

  async update(
    id: number,
    dto: UpdateDonacionDto,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Donacion> {
    const donacion = await this.findOne(id, usuarioId, usuario);
    await donacion.update(dto);
    return donacion;
  }

  async remove(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<void> {
    const donacion = await this.findOne(id, usuarioId, usuario);
    await donacion.destroy();
  }

  async findDonacionesConFiltros(
    usuarioId: number,
    usuario: JwtPayload,
    params: QueryOpcionesDto,
  ): Promise<{ donaciones: Donacion[]; total: number; totalPages: number }> {
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
        { destinatario: { [Op.iLike]: `%${q}%` } },
        { alias: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const { count, rows } = await this.donacionModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [User],
    });

    return {
      donaciones: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }
}
