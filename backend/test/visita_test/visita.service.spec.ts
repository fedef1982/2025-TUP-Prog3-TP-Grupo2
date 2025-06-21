import { Test, TestingModule } from '@nestjs/testing';
import { VisitaService } from '../../src/visita/visita.service';
import { getModelToken } from '@nestjs/sequelize';
import { Visita } from '../../src/visita/visita.model';
import { Publicacion } from '../../src/publicacion/publicacion.model';
import { Mascota } from '../../src/mascota/mascota.model';
import { Especie } from '../../src/mascota/especie/especie.model';
import { Condicion } from '../../src/mascota/condicion/condicion.model';
import { User } from '../../src/usuario/usuario.model';
import { AccesoService } from '../../src/acceso/acceso.service';
import { PublicacionesService } from '../../src/publicacion/publicacion.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  DisponibilidadHoraria,
  EstadoVisita,
} from '../../src/visita/dto/create-visita.dto';
import { Role } from '../../src/auth/roles.enum';
import { Op } from 'sequelize';
import { mockVisitaData, mockVisitaModel } from '../_mocks_/visita.model.mock';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';

const usuarioAdmin = { sub: 1, rol_id: Number(Role.ADMIN), username: 'admin' };
const usuarioPublicador = {
  sub: 2,
  rol_id: Number(Role.PUBLICADOR),
  username: 'publicador',
};

const mockPublicacionModel = () => ({
  findByPk: jest.fn(),
});

const mockAccesoService = {
  verificarUsuarioDeRuta: jest.fn(),
  verificarAcceso: jest.fn(),
};

const mockPublicacionesService = {
  validarPublicacion: jest.fn(),
};

function getVisitaExtendida(overrides: Partial<Visita> = {}): Visita {
  return {
    ...mockVisitaData,
    apellido: 'Test',
    telefono: '1234',
    email: 'mail@test.com',
    disponibilidad_fecha: new Date('2025-06-19T10:00:00Z'),
    disponibilidad_horario: DisponibilidadHoraria.Tarde,
    descripcion: 'desc',
    tracking: 'TRACK123',
    publicacion_id: 100,
    update: jest.fn(),
    destroy: jest.fn(),
    publicacion: {
      id: 100,
      mascota: {
        usuario_id: usuarioPublicador.sub,
      },
    },
    ...overrides,
  } as Visita;
}

describe('VisitaService', () => {
  let service: VisitaService;
  let visitaModel: ReturnType<typeof mockVisitaModel>;
  let publicacionModel: ReturnType<typeof mockPublicacionModel>;

  beforeEach(async () => {
    visitaModel = mockVisitaModel();
    publicacionModel = mockPublicacionModel();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitaService,
        { provide: getModelToken(Visita), useValue: visitaModel },
        { provide: getModelToken(Publicacion), useValue: publicacionModel },
        { provide: AccesoService, useValue: mockAccesoService },
        { provide: PublicacionesService, useValue: mockPublicacionesService },
      ],
    }).compile();

    service = module.get<VisitaService>(VisitaService);
  });

  describe('validarVisita', () => {
    it('debería devolver la visita si existe', async () => {
      visitaModel.findByPk.mockResolvedValue(mockVisitaData);
      const result = await service.validarVisita(100);
      expect(result).toBe(mockVisitaData);
      expect(visitaModel.findByPk).toHaveBeenCalledWith(100, {
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
    });

    it('lanza NotFoundException si no existe', async () => {
      visitaModel.findByPk.mockResolvedValue(null);
      await expect(service.validarVisita(100)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('debería devolver todas las visitas para admin', async () => {
      visitaModel.findAll.mockResolvedValue([mockVisitaData]);
      const result = await service.findAll(1, usuarioAdmin);
      expect(mockAccesoService.verificarUsuarioDeRuta).toHaveBeenCalledWith(
        usuarioAdmin,
        1,
      );
      expect(visitaModel.findAll).toHaveBeenCalledWith({
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
      expect(result).toEqual([mockVisitaData]);
    });

    it('debería filtrar por usuario_id si no es admin', async () => {
      visitaModel.findAll.mockResolvedValue([mockVisitaData]);
      const result = await service.findAll(2, usuarioPublicador);
      expect(visitaModel.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Publicacion,
            include: [
              {
                model: Mascota,
                include: [Especie, Condicion, User],
                where: { usuario_id: 2 },
              },
            ],
          },
        ],
      });
      expect(result).toEqual([mockVisitaData]);
    });
  });

  describe('findOne', () => {
    it('debería devolver la visita si el acceso es válido', async () => {
      jest.spyOn(service, 'validarVisita').mockResolvedValue(mockVisitaData);
      jest
        .spyOn(service as any, 'validarAccesoAVisita')
        .mockResolvedValue(mockVisitaData);

      const result = await service.findOne(100, 2, usuarioPublicador);
      expect(mockAccesoService.verificarUsuarioDeRuta).toHaveBeenCalledWith(
        usuarioPublicador,
        2,
      );
      expect(result).toBe(mockVisitaData);
    });
  });

  describe('create', () => {
    it('debería crear una visita correctamente', async () => {
      const dto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '111',
        email: 'test@gmail.com',
        disponibilidad_fecha: new Date('2025-06-19T10:00:00Z'),
        disponibilidad_horario: DisponibilidadHoraria.Maniana,
        descripcion: 'quiero adoptar',
      };
      mockPublicacionesService.validarPublicacion.mockResolvedValue({
        id: 100,
      });
      visitaModel.create.mockResolvedValue(mockVisitaData);

      jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
      jest
        .spyOn(global.Date.prototype, 'toISOString')
        .mockReturnValue('2025-06-20T12:00:00.000Z');

      const result = await service.create(dto, 100);

      expect(mockPublicacionesService.validarPublicacion).toHaveBeenCalledWith(
        100,
      );
      expect(visitaModel.create).toHaveBeenCalledWith({
        estado: EstadoVisita.Pendiente,
        ...dto,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tracking: expect.stringMatching(/^VISITA-20250620-[A-Z0-9]+$/),
        publicacion_id: 100,
      });
      expect(result).toEqual(mockVisitaData);

      jest.spyOn(global.Math, 'random').mockRestore();
      jest.spyOn(global.Date.prototype, 'toISOString').mockRestore();
    });
  });

  describe('update', () => {
    it('debería actualizar visita si es válida', async () => {
      const dto = { estado: EstadoVisita.Aprobado };
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...getVisitaExtendida(),
        estado: EstadoVisita.Pendiente,
        update: jest.fn().mockResolvedValue(undefined),
      } as any);

      const result = await service.update(100, dto, 1, usuarioAdmin);

      expect(service.findOne).toHaveBeenCalledWith(100, 1, usuarioAdmin);
      expect(result.update).toHaveBeenCalledWith(dto);
      expect(result.estado).toBe(EstadoVisita.Pendiente);
    });

    it('lanza ForbiddenException si la visita no está pendiente', async () => {
      const dto = { estado: EstadoVisita.Aprobado };
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...getVisitaExtendida(),
        estado: EstadoVisita.Aprobado,
        update: jest.fn(),
      } as any);

      await expect(service.update(100, dto, 1, usuarioAdmin)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('lanza ForbiddenException si el estado es inválido', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const dto = { estado: 'INVALIDO' } as any;
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...getVisitaExtendida(),
        estado: EstadoVisita.Pendiente,
        update: jest.fn(),
      } as any);

      await expect(service.update(100, dto, 1, usuarioAdmin)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar visita', async () => {
      const visitaMock = {
        ...getVisitaExtendida(),
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as Visita;
      jest.spyOn(service, 'findOne').mockResolvedValue(visitaMock);

      await service.remove(100, 1, usuarioAdmin);

      expect(service.findOne).toHaveBeenCalledWith(100, 1, usuarioAdmin);
      expect(visitaMock.destroy).toHaveBeenCalled();
    });
  });

  describe('getTracking', () => {
    it('debería devolver el estado, la fecha y la disponibilidad horaria de la visita si el tracking existe', async () => {
      visitaModel.findOne.mockResolvedValue(getVisitaExtendida());

      const result = await service.getTracking('TRACK123');

      expect(visitaModel.findOne).toHaveBeenCalledWith({
        where: { tracking: 'TRACK123' },
      });
      expect(result).toEqual({
        estado: getVisitaExtendida().estado,
        fecha: getVisitaExtendida().disponibilidad_fecha,
        horario: getVisitaExtendida().disponibilidad_horario,
      });
    });

    it('lanza NotFoundException si no existe el tracking', async () => {
      visitaModel.findOne.mockResolvedValue(null);
      await expect(service.getTracking('NOEXISTE')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findVisitasConFiltros', () => {
    it('debería devolver visitas con filtros para admin', async () => {
      const params: QueryOpcionesDto = {
        q: 'Juan',
        page: 1,
        limit: 10,
        sortBy: 'nombre',
        sortOrder: 'asc',
      };
      const mockRows = [getVisitaExtendida()];
      visitaModel.findAndCountAll.mockResolvedValue({
        rows: mockRows,
        count: 1,
      } as any);

      const result = await service.findVisitasConFiltros(
        1,
        usuarioAdmin,
        params,
      );

      expect(visitaModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%Juan%` } },
            { apellido: { [Op.iLike]: `%Juan%` } },
            { email: { [Op.iLike]: `%Juan%` } },
            { tracking: { [Op.iLike]: `%Juan%` } },
          ],
        },
        limit: 10,
        offset: 0,
        order: [['nombre', 'asc']],
        include: [
          {
            model: Publicacion,
            include: [Mascota],
          },
        ],
      });

      expect(result).toEqual({
        visitas: mockRows,
        total: 1,
        totalPages: 1,
      });
    });

    it('debería devolver visitas filtradas para publicador', async () => {
      const params: QueryOpcionesDto = {
        q: '',
        page: 1,
        limit: 10,
        sortBy: 'nombre',
        sortOrder: 'asc',
      };
      const mockRows = [getVisitaExtendida()];
      visitaModel.findAndCountAll.mockResolvedValue({
        rows: mockRows,
        count: 1,
      } as any);

      const result = await service.findVisitasConFiltros(
        2,
        usuarioPublicador,
        params,
      );

      expect(visitaModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['nombre', 'asc']],
        include: [
          {
            model: Publicacion,
            include: [
              {
                model: Mascota,
                include: [Especie, Condicion, User],
                where: { usuario_id: 2 },
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        visitas: mockRows,
        total: 1,
        totalPages: 1,
      });
    });
  });
});
