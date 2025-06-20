import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './usuario.model';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Role } from '../../src/auth/roles.enum';
import * as bcrypt from 'bcrypt';
import { AccesoService } from '../../src/acceso/acceso.service';
import { JwtPayload } from '../../src/auth/jwt-playload.interface';
import { Rol } from './rol.model';
import { EstadisticasUsuarioDto } from './dto/estadisticas-usuario.dto';
import { Mascota } from '../../src/mascota/mascota.model';
import { Publicacion } from '../../src/publicacion/publicacion.model';
import { Visita } from '../../src/visita/visita.model';
import { QueryOpcionesDto } from '../common/dto/query-opciones.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Mascota) private readonly mascotaModel: typeof Mascota,
    @InjectModel(Publicacion)
    private readonly publicacionModel: typeof Publicacion,
    @InjectModel(Visita) private readonly visitaModel: typeof Visita,
    private readonly accesoService: AccesoService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({ include: [Rol] });
  }

  async findOne(id: number, usuario: JwtPayload): Promise<User> {
    this.accesoService.verificarUsuarioDeRuta(usuario, id);
    const user = await this.userModel.findByPk(id, { include: [Rol] });
    if (!user) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }
    this.accesoService.verificarAcceso(usuario, { usuario_id: user.id });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
      include: [Rol],
    });
    if (!user) {
      throw new NotFoundException(`No existe un usuario con el email ${email}`);
    }
    return user;
  }

  private async validarEmailUnico(email: string): Promise<void> {
    const emailUsado = await this.userModel.findOne({ where: { email } });
    if (emailUsado) {
      throw new ConflictException('El email ingresado ya está registrado');
    }
  }

  async create(dto: CreateUsuarioDto): Promise<User> {
    await this.validarEmailUnico(dto.email);

    const contraseniaHasheada = await bcrypt.hash(dto.contrasenia, 10);

    return this.userModel.create({
      email: dto.email,
      nombre: dto.nombre,
      apellido: dto.apellido,
      contrasenia: contraseniaHasheada,
      rol_id: Role.PUBLICADOR,
      telefono: dto.telefono,
      direccion: dto.direccion,
    });
  }

  async update(
    id: number,
    dto: UpdateUsuarioDto,
    usuario: JwtPayload,
  ): Promise<User> {
    const user = await this.findOne(id, usuario);

    if (dto.email && dto.email !== user.email) {
      await this.validarEmailUnico(dto.email);
    }

    if (dto.contrasenia) {
      dto.contrasenia = await bcrypt.hash(dto.contrasenia, 10);
    }

    await user.update(dto);
    return user;
  }

  async remove(id: number, usuario: JwtPayload): Promise<void> {
    const user = await this.findOne(id, usuario);
    await user.destroy();
  }

  async getEstadisticas(
    id: number,
    usuario: JwtPayload,
  ): Promise<EstadisticasUsuarioDto> {
    this.accesoService.verificarUsuarioDeRuta(usuario, id);
    const esAdmin = usuario.rol_id === Number(Role.ADMIN);
    const whereUsuario = esAdmin ? {} : { usuario_id: usuario.sub };

    const [totalUsuarios, totalMascotas, totalPublicaciones, totalVisitas] =
      await Promise.all([
        esAdmin ? this.userModel.count() : Promise.resolve(1),
        this.mascotaModel.count({
          where: whereUsuario,
        }),
        this.publicacionModel.count({
          include: [
            {
              model: Mascota,
              where: whereUsuario,
            },
          ],
        }),
        this.visitaModel.count({
          include: [
            {
              model: Publicacion,
              include: [{ model: Mascota, where: whereUsuario }],
            },
          ],
        }),
      ]);
    return {
      totalUsuarios,
      totalMascotas,
      totalPublicaciones,
      totalVisitas,
    };
  }

  async findUsuariosConFiltros(
    id: number,
    usuario: JwtPayload,
    params: QueryOpcionesDto,
  ): Promise<{ users: User[]; total: number; totalPages: number }> {
    const esPublicador = usuario.rol_id === Number(Role.PUBLICADOR);

    if (esPublicador) {
      const user: User[] = [await this.findOne(id, usuario)];
      return {
        users: user,
        total: 1,
        totalPages: 1,
      };
    }

    const {
      q,
      page = 1,
      limit = 5,
      sortBy = 'nombre',
      sortOrder = 'asc',
    } = params;
    const offset = (page - 1) * limit;

    const where = q
      ? {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%${q}%` } },
            { apellido: { [Op.iLike]: `%${q}%` } },
            { email: { [Op.iLike]: `%${q}%` } },
          ],
        }
      : {};
    const { count, rows } = await this.userModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [{ model: Rol }],
    });
    const totalPages = Math.ceil(count / limit);
    return {
      users: rows,
      total: count,
      totalPages: totalPages,
    };
  }
}
