import { Test, TestingModule } from '@nestjs/testing';
import { MascotasController } from '../../src/mascota/mascota.controller';
import { MascotaService } from '../../src/mascota/mascota.service';
import { Mascota } from '../../src/mascota/mascota.model';
import { AuthenticatedRequest } from '../../src/auth/jwt-playload.interface';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Sexo, Tamanio } from '../../src/mascota/dto/create-mascota.dto';
import { AccesoService } from '../../src/acceso/acceso.service';

const mockAccesoService = {};

const reqAdmin: AuthenticatedRequest = {
  user: { sub: 1, rol_id: 1, username: 'admin@gmail.com' },
} as AuthenticatedRequest;

const reqPublicador: AuthenticatedRequest = {
  user: { sub: 2, rol_id: 2, username: 'publicador@gmail.com' },
} as AuthenticatedRequest;

describe('MascotasController', () => {
  let controller: MascotasController;
  let mockMascotaService: {
    findAll: jest.Mock;
    findMascotasConFiltros: jest.Mock;
    create: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    mockMascotaService = {
      findAll: jest.fn(),
      findMascotasConFiltros: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MascotasController],
      providers: [
        { provide: MascotaService, useValue: mockMascotaService },
        { provide: AccesoService, useValue: mockAccesoService },
      ],
    }).compile();

    controller = module.get<MascotasController>(MascotasController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('debería devolver todas las mascotas del usuario', async () => {
      const mascotas: Mascota[] = [{ id: 1 } as Mascota, { id: 2 } as Mascota];
      mockMascotaService.findAll.mockResolvedValue(mascotas);

      const result = await controller.findAll(1, reqAdmin);

      expect(mockMascotaService.findAll).toHaveBeenCalledWith(1, reqAdmin.user);
      expect(result).toEqual(mascotas);
    });

    it('lanza excepción si falla el service', async () => {
      mockMascotaService.findAll.mockRejectedValue(
        new NotFoundException('No encontrado'),
      );
      await expect(controller.findAll(1, reqAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMascotasConFiltros', () => {
    it('debería devolver mascotas paginadas/filtradas', async () => {
      const params: QueryOpcionesDto = {
        q: 'perro',
        page: 1,
        limit: 2,
        sortBy: 'nombre',
        sortOrder: 'asc',
      };
      const paged = {
        mascotas: [{ id: 1 } as Mascota],
        total: 1,
        totalPages: 1,
      };
      mockMascotaService.findMascotasConFiltros.mockResolvedValue(paged);

      const result = await controller.findMascotasConFiltros(
        1,
        reqAdmin,
        params,
      );

      expect(mockMascotaService.findMascotasConFiltros).toHaveBeenCalledWith(
        1,
        reqAdmin.user,
        params,
      );
      expect(result).toEqual(paged);
    });

    it('lanza excepción si falla el service', async () => {
      mockMascotaService.findMascotasConFiltros.mockRejectedValue(
        new ConflictException('Conflicto'),
      );
      await expect(
        controller.findMascotasConFiltros(1, reqAdmin, {} as QueryOpcionesDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('create', () => {
    it('debería crear una mascota', async () => {
      const dto = {
        nombre: 'Chai',
        raza: 'Labrador',
        sexo: Sexo.Macho,
        edad: 3,
        vacunado: true,
        tamanio: Tamanio.Grande,
        fotos_url: ['img.jpg'],
        especie_id: 1,
        condicion_id: 2,
      };
      const mascota = { id: 1, ...dto } as Mascota;
      mockMascotaService.create.mockResolvedValue(mascota);

      const result = await controller.create(dto, 2, reqPublicador);

      expect(mockMascotaService.create).toHaveBeenCalledWith(
        dto,
        2,
        reqPublicador.user,
      );
      expect(result).toEqual(mascota);
    });

    it('lanza excepción si falla el service', async () => {
      const dto = {
        nombre: 'Chai',
        raza: 'Labrador',
        sexo: Sexo.Macho,
        edad: 3,
        vacunado: true,
        tamanio: Tamanio.Grande,
        fotos_url: ['img.jpg'],
        especie_id: 1,
        condicion_id: 2,
      };
      mockMascotaService.create.mockRejectedValue(
        new ConflictException('Mascota duplicada'),
      );
      await expect(controller.create(dto, 2, reqPublicador)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('debería devolver una mascota por id', async () => {
      const mascota = { id: 15, nombre: 'Chai' } as Mascota;
      mockMascotaService.findOne.mockResolvedValue(mascota);

      const result = await controller.findOne(2, 15, reqAdmin);

      expect(mockMascotaService.findOne).toHaveBeenCalledWith(
        15,
        2,
        reqAdmin.user,
      );
      expect(result).toEqual(mascota);
    });

    it('lanza excepción si no se encuentra la mascota', async () => {
      mockMascotaService.findOne.mockRejectedValue(
        new NotFoundException('No encontrada'),
      );
      await expect(controller.findOne(2, 99, reqAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debería actualizar una mascota', async () => {
      const dto = { nombre: 'NUEVO', especie_id: 1, condicion_id: 2 };
      const mascota = {
        id: 15,
        nombre: 'NUEVO',
        especie_i: 1,
        condicion_id: 2,
      } as unknown as Mascota;
      mockMascotaService.update.mockResolvedValue(mascota);

      const result = await controller.update(2, 15, dto, reqAdmin);

      expect(mockMascotaService.update).toHaveBeenCalledWith(
        15,
        dto,
        2,
        reqAdmin.user,
      );
      expect(result).toEqual(mascota);
    });

    it('lanza excepción si update falla', async () => {
      const dto = { nombre: 'NUEVO', especie_id: 1, condicion_id: 2 };
      mockMascotaService.update.mockRejectedValue(
        new NotFoundException('No encontrada'),
      );
      await expect(controller.update(2, 15, dto, reqAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar una mascota', async () => {
      mockMascotaService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(2, 15, reqAdmin);

      expect(mockMascotaService.remove).toHaveBeenCalledWith(
        15,
        2,
        reqAdmin.user,
      );
      expect(result).toBeUndefined();
    });

    it('lanza excepción si remove falla', async () => {
      mockMascotaService.remove.mockRejectedValue(
        new NotFoundException('No encontrada'),
      );
      await expect(controller.remove(2, 99, reqAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
