import { Test, TestingModule } from '@nestjs/testing';
import { MascotaService } from '../../src/mascota/mascota.service';
import { getModelToken } from '@nestjs/sequelize';
import { Mascota } from '../../src/mascota/mascota.model';
import { Especie } from '../../src/mascota/especie/especie.model';
import { Condicion } from '../../src/mascota/condicion/condicion.model';
import { User } from '../../src/usuario/usuario.model';
import { AccesoService } from '../../src/acceso/acceso.service';
import {
  mockMascotaModel,
  mockMascotaData,
} from '../_mocks_/mascota.model.mock';
import { mockEspecieModel } from '../_mocks_/especie.model.mock';
import { mockCondicionModel } from '../_mocks_/condicion.model.mock';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../../src/auth/roles.enum';
import { Op } from 'sequelize';
import { Sexo, Tamanio } from '../../src/mascota/dto/create-mascota.dto';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';
import { EspecieService } from '../../src/mascota/especie/especie.service';
import { CondicionService } from '../../src/mascota/condicion/condicion.service';

const usuarioMock = { sub: 1, rol_id: Number(Role.ADMIN), username: 'admin' };

const mockAccesoService = {
  verificarUsuarioDeRuta: jest.fn(),
  verificarAcceso: jest.fn(),
};

const mockEspecieService = { validarEspecie: jest.fn() };
const mockCondicionService = { validarCondicion: jest.fn() };

describe('MascotaService', () => {
  let service: MascotaService;
  let mascotaModel: ReturnType<typeof mockMascotaModel>;

  beforeEach(async () => {
    mascotaModel = mockMascotaModel();

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MascotaService,
        { provide: getModelToken(Mascota), useValue: mascotaModel },
        { provide: getModelToken(Especie), useValue: mockEspecieModel() },
        { provide: getModelToken(Condicion), useValue: mockCondicionModel() },
        { provide: getModelToken(User), useValue: {} },
        { provide: EspecieService, useValue: mockEspecieService },
        { provide: CondicionService, useValue: mockCondicionService },
        { provide: AccesoService, useValue: mockAccesoService },
      ],
    }).compile();

    service = module.get<MascotaService>(MascotaService);
  });

  describe('validarMascota', () => {
    it('debería devolver la mascota si existe', async () => {
      mascotaModel.findByPk.mockResolvedValue(mockMascotaData);
      const result = await service.validarMascota(10);
      expect(result).toBe(mockMascotaData);
      expect(mascotaModel.findByPk).toHaveBeenCalledWith(10, {
        include: [Especie, Condicion, User],
      });
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mascotaModel.findByPk.mockResolvedValue(null);
      await expect(service.validarMascota(10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('debería devolver todas las mascotas para admin', async () => {
      mascotaModel.findAll.mockResolvedValue([mockMascotaData]);
      const result = await service.findAll(1, usuarioMock);
      expect(mockAccesoService.verificarUsuarioDeRuta).toHaveBeenCalledWith(
        usuarioMock,
        1,
      );
      expect(mascotaModel.findAll).toHaveBeenCalledWith({
        where: {},
        include: [Especie, Condicion, User],
      });
      expect(result).toEqual([mockMascotaData]);
    });

    it('debería filtrar por usuario para publicador', async () => {
      const usuarioPublicador = {
        sub: 2,
        rol_id: Number(Role.PUBLICADOR),
        username: 'user',
      };
      mascotaModel.findAll.mockResolvedValue([mockMascotaData]);
      const result = await service.findAll(2, usuarioPublicador);
      expect(mascotaModel.findAll).toHaveBeenCalledWith({
        where: { usuario_id: usuarioPublicador.sub },
        include: [Especie, Condicion, User],
      });
      expect(result).toEqual([mockMascotaData]);
    });
  });

  describe('findOne', () => {
    it('debería devolver la mascota si el acceso es válido', async () => {
      jest.spyOn(service, 'validarMascota').mockResolvedValue(mockMascotaData);
      const result = await service.findOne(10, 1, usuarioMock);
      expect(mockAccesoService.verificarUsuarioDeRuta).toHaveBeenCalledWith(
        usuarioMock,
        1,
      );
      expect(mockAccesoService.verificarAcceso).toHaveBeenCalledWith(
        usuarioMock,
        mockMascotaData,
      );
      expect(result).toBe(mockMascotaData);
    });
  });

  describe('create', () => {
    it('debería crear una mascota correctamente', async () => {
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
      mockEspecieService.validarEspecie.mockResolvedValue(undefined);
      mockCondicionService.validarCondicion.mockResolvedValue(undefined);
      mockAccesoService.verificarUsuarioDeRuta.mockReturnValue(undefined);
      mascotaModel.create.mockResolvedValue(mockMascotaData);

      const result = await service.create(dto, 1, usuarioMock);

      expect(mockAccesoService.verificarUsuarioDeRuta).toHaveBeenCalledWith(
        usuarioMock,
        1,
      );
      expect(mockEspecieService.validarEspecie).toHaveBeenCalledWith(1);
      expect(mockCondicionService.validarCondicion).toHaveBeenCalledWith(2);
      expect(mascotaModel.create).toHaveBeenCalledWith({
        ...dto,
        usuario_id: usuarioMock.sub,
      });
      expect(result).toBe(mockMascotaData);
    });
  });

  describe('update', () => {
    it('debería actualizar mascota correctamente', async () => {
      const dto = { nombre: 'Nuevo Nombre', especie_id: 2, condicion_id: 3 };
      const mascotaMock = {
        ...mockMascotaData,
        especie_id: 1,
        condicion_id: 2,
        update: jest.fn().mockResolvedValue(undefined),
      } as unknown as Mascota;

      jest.spyOn(service, 'findOne').mockResolvedValue(mascotaMock);
      mockEspecieService.validarEspecie.mockResolvedValue(undefined);
      mockCondicionService.validarCondicion.mockResolvedValue(undefined);

      const result = await service.update(10, dto, 1, usuarioMock);

      expect(service.findOne).toHaveBeenCalledWith(10, 1, usuarioMock);
      expect(mockEspecieService.validarEspecie).toHaveBeenCalledWith(2);
      expect(mockCondicionService.validarCondicion).toHaveBeenCalledWith(3);
      expect(mascotaMock.update).toHaveBeenCalledWith(dto);
      expect(result).toBe(mascotaMock);
    });

    it('no valida especie ni condición si no cambian', async () => {
      const dto = { nombre: 'Solo Nombre', especie_id: 1, condicion_id: 2 };
      const mascotaMock = {
        ...mockMascotaData,
        especie_id: 1,
        condicion_id: 2,
        update: jest.fn().mockResolvedValue(undefined),
      } as unknown as Mascota;

      jest.spyOn(service, 'findOne').mockResolvedValue(mascotaMock);

      const result = await service.update(10, dto, 1, usuarioMock);

      expect(mockEspecieService.validarEspecie).not.toHaveBeenCalled();
      expect(mockCondicionService.validarCondicion).not.toHaveBeenCalled();
      expect(mascotaMock.update).toHaveBeenCalledWith(dto);
      expect(result).toBe(mascotaMock);
    });
  });

  describe('remove', () => {
    it('debería eliminar la mascota correctamente', async () => {
      const mascotaMock = {
        ...mockMascotaData,
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as Mascota;
      jest.spyOn(service, 'findOne').mockResolvedValue(mascotaMock);

      await service.remove(10, 1, usuarioMock);

      expect(service.findOne).toHaveBeenCalledWith(10, 1, usuarioMock);
      expect(mascotaMock.destroy).toHaveBeenCalled();
    });
  });

  describe('findMascotasConFiltros', () => {
    it('debería devolver mascotas con paginación y filtros', async () => {
      const params: QueryOpcionesDto = {
        q: 'Chai',
        page: 2,
        limit: 1,
        sortBy: 'nombre',
        sortOrder: 'desc',
      };
      const mockRows = [mockMascotaData];
      mascotaModel.findAndCountAll.mockResolvedValue({
        rows: mockRows,
        count: 2,
      } as any);

      const result = await service.findMascotasConFiltros(
        1,
        usuarioMock,
        params,
      );

      expect(mascotaModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { raza: { [Op.iLike]: `%Chai%` } },
            { nombre: { [Op.iLike]: `%Chai%` } },
          ],
        },
        limit: 1,
        offset: 1,
        order: [['nombre', 'desc']],
        include: [Especie, Condicion, User],
      });

      expect(result).toEqual({
        mascotas: mockRows,
        total: 2,
        totalPages: 2,
      });
    });
  });
});
