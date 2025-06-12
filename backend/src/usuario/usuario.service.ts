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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
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
}
