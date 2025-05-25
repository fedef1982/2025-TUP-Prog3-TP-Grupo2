import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './usuario.model';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }
    return user;
  }

  private async validarEmailUnico(email: string): Promise<void> {
    const emailUsado = await this.userModel.findOne({ where: { email } });
    if (emailUsado) {
      throw new ConflictException(
        'El email ingresado ya está siendo utilizado por otro usuario',
      );
    }
  }

  async create(dto: CreateUsuarioDto): Promise<User> {
    await this.validarEmailUnico(dto.email);

    return this.userModel.create({
      email: dto.email,
      nombre: dto.nombre,
      apellido: dto.apellido,
      contrasenia: dto.contrasenia,
      rol: 'Publicador',
      telefono: dto.telefono,
      direccion: dto.direccion,
    });
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      await this.validarEmailUnico(dto.email);
    }

    await user.update(dto);
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
