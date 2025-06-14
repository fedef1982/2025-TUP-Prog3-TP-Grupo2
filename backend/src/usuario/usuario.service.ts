import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './usuario.model';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Role } from 'src/auth/roles.enum';
import * as bcrypt from 'bcrypt';
import { AccesoService } from 'src/acceso/acceso.service';
import { JwtPayload } from 'src/auth/jwt-playload.interface';
import { Rol } from './rol.model';
import { EstadisticasUsuarioDto } from './dto/estadisticas-usuario.dto';
import { Mascota } from 'src/mascota/mascota.model';
import { Publicacion } from 'src/publicacion/publicacion.model';
import { Visita } from 'src/visita/visita.model';

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
    return user;
  }

  async findByEmail(email: string): Promise<User> {
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
    this.accesoService.verificarAcceso(usuario, { usuario_id: user.id });

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
    this.accesoService.verificarAcceso(usuario, { usuario_id: user.id });
    await user.destroy();
  }

  async getEstadisticas(
    id: number,
    usuario: JwtPayload,
  ): Promise<EstadisticasUsuarioDto> {
    const user = await this.findOne(id, usuario);
    this.accesoService.verificarAcceso(usuario, { usuario_id: user.id });
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
}
