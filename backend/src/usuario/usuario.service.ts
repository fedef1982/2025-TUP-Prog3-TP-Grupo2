import {
  ConflictException,
  ForbiddenException,
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
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Rol)
    private rolModel: typeof Rol,
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

  // servicios query y paginado
  async getTotalPages(
    query: string = '',
    limit: number = 10,
    id?: number,
    usuario?: JwtPayload 
  ): Promise<number> {
    let where: any = {};
    
    if (query) {
      where = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${query}%` } },
          { apellido: { [Op.like]: `%${query}%` } }, 
          { email: { [Op.like]: `%${query}%` } },
          { '$rol.nombre$': { [Op.like]: `%${query}%` } },
        ],
      };
    }

    if (id) {
      where = { ...where, id };

      if (!usuario) {
        throw new Error('Usuario no autenticado');
      }

      const user = await this.findOne(id, usuario);    
      this.accesoService.verificarAcceso(usuario, { usuario_id: user.id });
    }

    const include = query.includes('rol') ? [{ model: this.rolModel, as: 'rol' }] : [];

    const totalCount = await this.userModel.count({
      where,
      include,
      distinct: true
    });

    return Math.ceil(totalCount / limit);
  }

  async getUsersPage(
    page: number = 1,
    limit: number = 10,
    query: string = '',
    id?: number,
    usuario?: JwtPayload
  ): Promise<{ users: User[]; totalPages: number }> {
    const offset = (page - 1) * limit;
    let where: any = {};
    
    if (query) {
      where = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${query}%` } },
          { apellido: { [Op.like]: `%${query}%` } }, 
          { email: { [Op.like]: `%${query}%` } },
          { '$rol.nombre$': { [Op.like]: `%${query}%` } },
        ],
      };
    }

    if (id) {
      where = { ...where, id };

      if (!usuario) {
        throw new Error('Usuario no autenticado');
      }

      const user = await this.findOne(id, usuario);    
      this.accesoService.verificarAcceso(usuario, { usuario_id: user.id });
    }

    const include = query.includes('rol') ? [{ model: this.rolModel, as: 'rol' }] : [];

    const { count, rows } = await this.userModel.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      users: rows,
      totalPages
    };
  }
  
  async getFilteredUsers(params: {
    query: string;
    page: number;
    limit: number;
    rol_id?: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ users: User[]; total: number }> {
    const { query, page, limit, rol_id, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

    const where: any = {};
    console.log('##############################################');
    console.log(query, page,limit);
    console.log('##############################################');
    if (query) {
      where[Op.or] = [
        { nombre: { [Op.iLike]: `%${query}%` } },
        { apellido: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (rol_id) {
      where.rol_id = rol_id;
    }

    const order: [string, 'asc' | 'desc'][] = [];
    
    if (sortBy && ['nombre', 'apellido', 'email', 'createdAt'].includes(sortBy)) {
      order.push([sortBy, sortOrder]);
    } else {
      order.push(['nombre', 'asc']);
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [{ model: this.rolModel, as: 'rol' }],
    });

    return {
      users: rows,
      total: count,
    };
  }
}

