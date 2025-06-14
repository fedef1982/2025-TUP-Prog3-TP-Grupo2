import { Injectable, NotFoundException } from '@nestjs/common';
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
      '##################### mascota de la publicacion:',
      JSON.stringify(publiJSON.mascota),
    );
    console.log(
      '##################### id del usuario de la mascota:',
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
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const publicacion = await this.validarAccesoAPublicacion(id, usuario);
    await publicacion.update(dto);
    return publicacion;
  }

  async remove(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<void> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const publicacion = await this.validarAccesoAPublicacion(id, usuario);
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

  async findOnePublica(id: number): Promise<Publicacion> {
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
}
