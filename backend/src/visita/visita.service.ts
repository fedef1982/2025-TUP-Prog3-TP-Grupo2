import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Visita } from './visita.model';
import { CreateVisitaDto, EstadoVisita } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { JwtPayload } from '../auth/jwt-playload.interface';
import { AccesoService } from '../acceso/acceso.service';
import { Publicacion } from '../publicacion/publicacion.model';
import { Role } from '../auth/roles.enum';
import { Mascota } from '../mascota/mascota.model';
import { PublicacionesService } from '../publicacion/publicacion.service';
import { Especie } from '../mascota/especie.model';
import { Condicion } from '../mascota/condicion.model';
import { User } from '../usuario/usuario.model';
import { TrackingVisita } from './dto/tracking-visita.dto';

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

  private generarTracking(): string {
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `VISITA-${fecha}-${random}`;
  }

  async create(dto: CreateVisitaDto, publicacionId: number): Promise<Visita> {
    const publicacion =
      await this.publicacionService.validarPublicacion(publicacionId);
    const trackingVisita = this.generarTracking();
    return this.visitaModel.create({
      estado: EstadoVisita.Pendiente,
      nombre: dto.nombre,
      apellido: dto.apellido,
      telefono: dto.telefono,
      email: dto.email,
      disponibilidad_fecha: dto.disponibilidad_fecha,
      disponibilidad_horario: dto.disponibilidad_horario,
      descripcion: dto.descripcion,
      tracking: trackingVisita,
      publicacion_id: publicacion.id,
    });
  }

  async update(
    id: number,
    dto: UpdateVisitaDto,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<Visita> {
    const visita = await this.findOne(id, usuarioId, usuario);

    if (dto.estado) {
      if (visita.estado !== EstadoVisita.Pendiente) {
        throw new ForbiddenException(
          `Solo se pueden modificar visitas pendientes`,
        );
      }
      if (!Object.values(EstadoVisita).includes(dto.estado)) {
        throw new ForbiddenException('Estado inválido');
      }
    }
    await visita.update(dto);
    return visita;
  }

  async remove(
    id: number,
    usuarioId: number,
    usuario: JwtPayload,
  ): Promise<void> {
    const visita = await this.findOne(id, usuarioId, usuario);
    await visita.destroy();
  }

  async getTracking(tracking: string): Promise<TrackingVisita> {
    const visita = await this.visitaModel.findOne({ where: { tracking } });
    if (!visita) {
      throw new NotFoundException(`Formulario de visita no encontrado`);
    }
    return {
      estado: visita.estado,
      fecha: visita.disponibilidad_fecha,
      horario: visita.disponibilidad_horario,
    };
  }
}
