import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Visita } from './visita.model';
import { CreateVisitaDto, EstadoVisita } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { JwtPayload } from 'src/auth/jwt-playload.interface';
import { AccesoService } from 'src/acceso/acceso.service';
import { Publicacion } from 'src/publicacion/publicacion.model';
import { Role } from 'src/auth/roles.enum';
import { Mascota } from 'src/mascota/mascota.model';
import { PublicacionesService } from 'src/publicacion/publicacion.service';
import { Especie } from 'src/mascota/especie.model';
import { Condicion } from 'src/mascota/condicion.model';
import { User } from 'src/usuario/usuario.model';

@Injectable()
export class VisitaService {
  constructor(
    @InjectModel(Visita)
    private visitaModel: typeof Visita,

    @InjectModel(Publicacion)
    private publicacionModel: typeof Publicacion,
    private readonly publicacionService: PublicacionesService,
    private readonly accesoService: AccesoService,
  ) {}

  public async validarVisita(id: number): Promise<Visita> {
    const visita = await this.visitaModel.findByPk(id, {
      include: [
        {
          model: Publicacion,
          include: [
            {
              model: Mascota,
              include: [Especie, Condicion, User],
            },
          ],
        },
      ],
    });
    if (!visita) {
      throw new NotFoundException(`La visita con ID ${id} no existe`);
    }
    return visita;
  }

  private async validarAccesoAVisita(
    id: number,
    usuario: JwtPayload,
  ): Promise<Visita> {
    const visita = await this.validarVisita(id);
    const visitaJSON = JSON.parse(JSON.stringify(visita)) as Visita;
    this.accesoService.verificarAcceso(usuario, {
      usuario_id: visitaJSON.publicacion.mascota.usuario_id,
    });
    return visita;
  }

  async findAll(usuarioId: number, usuario: JwtPayload): Promise<Visita[]> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const esAdmin = usuario.rol_id === Number(Role.ADMIN);
    return this.visitaModel.findAll({
      include: [
        {
          model: Publicacion,
          include: [
            {
              model: Mascota,
              include: [Especie, Condicion, User],
              ...(esAdmin
                ? {}
                : {
                    where: { usuario_id: usuarioId },
                  }),
            },
          ],
        },
      ],
    });
  }

  async findOne(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Visita> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const visita = await this.validarAccesoAVisita(id, usuario);
    return visita;
  }

  async create(dto: CreateVisitaDto, publicacionId: number): Promise<Visita> {
    const publicacion =
      await this.publicacionService.validarPublicacion(publicacionId);
    return this.visitaModel.create({
      estado: EstadoVisita.Pendiente,
      nombre: dto.nombre,
      apellido: dto.apellido,
      telefono: dto.telefono,
      email: dto.email,
      disponibilidad_fecha: dto.disponibilidad_fecha,
      disponibilidad_horario: dto.disponibilidad_horario,
      descripcion: dto.descripcion,
      publicacion_id: publicacion.id,
    });
  }

  async update(
    id: number,
    dto: UpdateVisitaDto,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Visita> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const visita = await this.findOne(id, usuarioId, usuario);
    await visita.update(dto);
    return visita;
  }

  async remove(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<void> {
    this.accesoService.verificarUsuarioDeRuta(usuario, usuarioId);
    const visita = await this.findOne(id, usuarioId, usuario);
    await visita.destroy();
  }
}
