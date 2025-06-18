import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EstadoPublicacion, Publicacion } from './publicacion.model';
import { Mascota } from '../mascota/mascota.model';
import { MascotaService } from 'src/mascota/mascota.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { JwtPayload } from 'src/auth/jwt-playload.interface';
import { Role } from 'src/auth/roles.enum';
import { AccesoService } from 'src/acceso/acceso.service';
import { Especie } from 'src/mascota/especie.model';
import { Condicion } from 'src/mascota/condicion.model';
import { User } from 'src/usuario/usuario.model';
import { Op } from 'sequelize';
import { QueryOpcionesDto } from 'src/common/dto/query-opciones.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion)
    private publicacionModel: typeof Publicacion,

    @InjectModel(Mascota)
    private mascotaModel: typeof Mascota,
    private readonly mascotaService: MascotaService,
    private readonly accesoService: AccesoService,
  ) {}

  public async validarPublicacion(id: number): Promise<Publicacion> {
    const publicacion = await this.publicacionModel.findByPk(id, {
      include: [
        {
          model: Mascota,
          include: [Especie, Condicion, User],
        },
      ],
    });

    if (!publicacion) {
      throw new NotFoundException(`La publicacion con ID ${id} no existe`);
    }
    return publicacion;
  }

  private async validarAccesoAPublicacion(
    id: number,
    usuario: JwtPayload,
  ): Promise<Publicacion> {
    const publicacion = await this.validarPublicacion(id);
    const publiJSON = JSON.parse(JSON.stringify(publicacion)) as Publicacion;
    console.log(
      '############ id del usuario de la mascota:',
      JSON.stringify(publiJSON.mascota.usuario.id),
    );
    this.accesoService.verificarAcceso(usuario, {
      usuario_id: publiJSON.mascota.usuario_id,
    });
    return publicacion;
  }

  async findAll(
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Publicacion[]> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const whereMascota =
      usuario.rol_id === Number(Role.ADMIN) ? {} : { usuario_id: usuario.sub };
    return this.publicacionModel.findAll({
      include: [
        {
          model: Mascota,
          where: whereMascota,
          include: [Especie, Condicion, User],
        },
      ],
    });
  }

  async findOne(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Publicacion> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const publicacion = await this.validarAccesoAPublicacion(id, usuario);
    return publicacion;
  }

  async create(
    publicacionDto: CreatePublicacionDto,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Publicacion> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const mascota = await this.mascotaService.validarMascota(
      publicacionDto.mascota_id,
    );

    this.accesoService.verificarAcceso(usuario, {
      usuario_id: mascota.usuario_id,
    });

    return this.publicacionModel.create({
      titulo: publicacionDto.titulo,
      descripcion: publicacionDto.descripcion,
      ubicacion: publicacionDto.ubicacion,
      contacto: publicacionDto.contacto,
      mascota_id: mascota.id,
      estado: EstadoPublicacion.Abierta,
    });
  }

  async update(
    id: number,
    dto: UpdatePublicacionDto,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Publicacion> {
    const publicacion = await this.findOne(id, usuarioId, usuario);

    if (dto.publicado !== undefined) {
      if (usuario.rol_id !== Number(Role.ADMIN)) {
        throw new ForbiddenException(
          'Solo el admin puede publicar publicaciones',
        );
      }

      if (publicacion.estado !== EstadoPublicacion.Abierta) {
        throw new ForbiddenException(
          'Solo se pueden publicar publicaciones que estén en estado Abierta',
        );
      }
    }

    if (dto.estado) {
      if (publicacion.estado !== EstadoPublicacion.Abierta) {
        throw new ForbiddenException(
          `Solo se pueden cerrar publicaciones abiertas`,
        );
      }
      if (!Object.values(EstadoPublicacion).includes(dto.estado)) {
        throw new ForbiddenException('Estado inválido');
      }
    }

    await publicacion.update(dto);
    return publicacion;
  }

  async remove(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<void> {
    const publicacion = await this.findOne(id, usuarioId, usuario);
    await publicacion.destroy();
  }

  async findPublicadasYAbiertas(): Promise<Publicacion[]> {
    return this.publicacionModel.findAll({
      where: {
        estado: EstadoPublicacion.Abierta,
        publicado: {
          [Op.not]: null,
        },
      },
      include: [
        {
          model: Mascota,
          include: [Especie, Condicion, User],
        },
      ],
    });
  }

  async findOnePublicada(id: number): Promise<Publicacion> {
    const publicacion = await this.publicacionModel.findOne({
      where: {
        id,
        estado: EstadoPublicacion.Abierta,
        publicado: { [Op.not]: null },
      },
      include: [
        {
          model: Mascota,
          include: [Especie, Condicion, User],
        },
      ],
    });

    if (!publicacion) {
      throw new NotFoundException(
        `No se encontró una publicación abierta y publicada con ID ${id}`,
      );
    }

    return publicacion;
  }

  async findPublicacionesConFiltros(
    usuarioId: number,
    usuario: JwtPayload,
    params: QueryOpcionesDto,
  ): Promise<{
    publicaciones: Publicacion[];
    total: number;
    totalPages: number;
  }> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const {
      q,
      page = 1,
      limit = 10,
      sortBy = 'titulo',
      sortOrder = 'asc',
    } = params;
    const offset = (page - 1) * limit;

    const wherePublicacion = q
      ? {
          [Op.or]: [
            { titulo: { [Op.iLike]: `%${q}%` } },
            { descripcion: { [Op.iLike]: `%${q}%` } },
            { ubicacion: { [Op.iLike]: `%${q}%` } },
          ],
        }
      : {};
    const includeMascota =
      usuario.rol_id === Number(Role.ADMIN)
        ? [Mascota]
        : [
            {
              model: Mascota,
              where: { usuario_id: usuarioId },
            },
          ];
    const { count, rows } = await this.publicacionModel.findAndCountAll({
      where: wherePublicacion,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: includeMascota,
    });

    return {
      publicaciones: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }
}
