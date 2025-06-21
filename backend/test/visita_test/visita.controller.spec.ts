import { Test, TestingModule } from '@nestjs/testing';
import { VisitaController } from '../../src/visita/visita.controller';
import { VisitaService } from '../../src/visita/visita.service';
import { mockVisitaData } from '../_mocks_/visita.model.mock';
import { NotFoundException } from '@nestjs/common';
import { AuthenticatedRequest } from '../../src/auth/jwt-playload.interface';
import {
  DisponibilidadHoraria,
  EstadoVisita,
} from '../../src/visita/dto/create-visita.dto';

const mockVisitaService = {
  findAll: jest.fn(),
  findVisitasConFiltros: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  getTracking: jest.fn(),
};

const reqAdmin = {
  user: { sub: 1, rol_id: 1, username: 'admin' },
} as AuthenticatedRequest;

const reqPublicador = {
  user: { sub: 2, rol_id: 2, username: 'publicador' },
} as AuthenticatedRequest;

describe('VisitaController', () => {
  let controller: VisitaController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitaController],
      providers: [{ provide: VisitaService, useValue: mockVisitaService }],
    }).compile();

    controller = module.get<VisitaController>(VisitaController);
  });

  describe('findAll', () => {
    it('debería devolver todas las visitas del usuario', async () => {
      mockVisitaService.findAll.mockResolvedValue([mockVisitaData]);
      const result = await controller.findAll(2, reqPublicador);
      expect(mockVisitaService.findAll).toHaveBeenCalledWith(
        2,
        reqPublicador.user,
      );
      expect(result).toEqual([mockVisitaData]);
    });

    it('debería lanzar error si el service lanza error', async () => {
      mockVisitaService.findAll.mockRejectedValue(
        new NotFoundException('No se encontraron visitas'),
      );
      await expect(controller.findAll(1, reqAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findVisitasConFiltros', () => {
    it('debería devolver visitas filtradas', async () => {
      const response = { visitas: [mockVisitaData], total: 1, totalPages: 1 };
      mockVisitaService.findVisitasConFiltros.mockResolvedValue(response);

      const result = await controller.findVisitasConFiltros(2, reqPublicador, {
        q: '',
        page: 1,
        limit: 10,
      });
      expect(mockVisitaService.findVisitasConFiltros).toHaveBeenCalledWith(
        2,
        reqPublicador.user,
        { q: '', page: 1, limit: 10 },
      );
      expect(result).toEqual(response);
    });

    it('debería lanzar error si el service lanza error', async () => {
      mockVisitaService.findVisitasConFiltros.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(
        controller.findVisitasConFiltros(1, reqAdmin, { q: 'algo' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('debería devolver una visita específica', async () => {
      mockVisitaService.findOne.mockResolvedValue(mockVisitaData);
      const result = await controller.findOne(2, 100, reqPublicador);
      expect(mockVisitaService.findOne).toHaveBeenCalledWith(
        100,
        2,
        reqPublicador.user,
      );
      expect(result).toEqual(mockVisitaData);
    });

    it('debería lanzar error si el service lanza error', async () => {
      mockVisitaService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne(2, 100, reqPublicador)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debería actualizar una visita', async () => {
      const dto = { estado: EstadoVisita.Aprobado };
      mockVisitaService.update.mockResolvedValue({ ...mockVisitaData, ...dto });

      const result = await controller.update(2, 100, dto, reqAdmin);
      expect(mockVisitaService.update).toHaveBeenCalledWith(
        100,
        dto,
        2,
        reqAdmin.user,
      );
      expect(result).toEqual({ ...mockVisitaData, ...dto });
    });

    it('debería lanzar error si el service lanza error', async () => {
      mockVisitaService.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update(2, 100, {}, reqAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar una visita', async () => {
      mockVisitaService.remove.mockResolvedValue(undefined);
      await expect(
        controller.remove(2, 100, reqPublicador),
      ).resolves.toBeUndefined();
      expect(mockVisitaService.remove).toHaveBeenCalledWith(
        100,
        2,
        reqPublicador.user,
      );
    });

    it('debería lanzar error si el service lanza error', async () => {
      mockVisitaService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove(2, 100, reqAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('debería crear una visita', async () => {
      const dto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '111',
        email: 'test@gmail.com',
        disponibilidad_fecha: new Date('2025-06-19T10:00:00Z'),
        disponibilidad_horario: DisponibilidadHoraria.Maniana,
        descripcion: 'quiero adoptar',
      };
      mockVisitaService.create.mockResolvedValue(mockVisitaData);
      const result = await controller.create(dto, 200);
      expect(mockVisitaService.create).toHaveBeenCalledWith(dto, 200);
      expect(result).toEqual(mockVisitaData);
    });

    it('debería lanzar error si el service lanza error', async () => {
      mockVisitaService.create.mockRejectedValue(new NotFoundException());
      await expect(controller.create({} as any, 100)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getEstado', () => {
    it('debería devolver el tracking de una visita', async () => {
      const trackingVisita = {
        estado: 'Pendiente',
        fecha: new Date('2025-06-19T10:00:00Z'),
        horario: 'Maniana',
      };
      mockVisitaService.getTracking.mockResolvedValue(trackingVisita);

      const result = await controller.getEstado('TRACK123');
      expect(mockVisitaService.getTracking).toHaveBeenCalledWith('TRACK123');
      expect(result).toEqual(trackingVisita);
    });

    it('debería lanzar error si el tracking no existe', async () => {
      mockVisitaService.getTracking.mockRejectedValue(new NotFoundException());
      await expect(controller.getEstado('NOEXISTE')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
