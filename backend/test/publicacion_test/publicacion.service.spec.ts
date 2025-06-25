import { Test, TestingModule } from '@nestjs/testing';
import { PublicacionesService } from '../../src/publicacion/publicacion.service';
import {
  Publicacion,
  EstadoPublicacion,
} from '../../src/publicacion/publicacion.model';
import { MascotaService } from '../../src/mascota/mascota.service';
import { AccesoService } from '../../src/acceso/acceso.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '../../src/auth/jwt-playload.interface';
import { Role } from '../../src/auth/roles.enum';
import { Op } from 'sequelize';

const mockPublicacionModel = {
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findAndCountAll: jest.fn(),
};

const mockMascotaModel = {
  // PublicacionesService ya está inyectando el modelo correspondiente
};

const mockMascotaService = {
  validarMascota: jest.fn(),
};

const mockAccesoService = {
  verificarAcceso: jest.fn(),
  verificarUsuarioDeRuta: jest.fn(),
};

describe('PublicacionesService', () => {
  let service: PublicacionesService;

  const mockPublicador: JwtPayload = {
    sub: 1,
    rol_id: Number(Role.PUBLICADOR),
  } as JwtPayload;

  const mockAdmin: JwtPayload = {
    sub: 99,
    rol_id: Number(Role.ADMIN),
  } as JwtPayload;

  const mockPublicacion = {
    id: 1,
    titulo: 'Publicacion Test',
    descripcion: 'Descripción de la publicación',
    ubicacion: 'Bs. As.',
    contacto: 'Contacto',
    mascota_id: 1,
    publicado: new Date('2025-06-19T10:00:00Z'),
    estado: EstadoPublicacion.Abierta,
    mascota: {
      id: 1,
      usuario_id: 1,
      usuario: { id: 1 },
      especie: {},
      condicion: {},
    },
    update: jest.fn(),
    destroy: jest.fn(),
  } as unknown as Publicacion;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicacionesService,
        { provide: 'PublicacionRepository', useValue: mockPublicacionModel },
        { provide: 'MascotaRepository', useValue: mockMascotaModel },
        { provide: MascotaService, useValue: mockMascotaService },
        { provide: AccesoService, useValue: mockAccesoService },
      ],
    })
      // Al usar @InjectModel se deben usar tokens correctos para inyectar los mocks
      .overrideProvider('PublicacionRepository')
      .useValue(mockPublicacionModel)
      .overrideProvider('MascotaRepository')
      .useValue(mockMascotaModel)
      .compile();

    service = module.get<PublicacionesService>(PublicacionesService);

    jest.clearAllMocks();
  });

  describe('validarPublicacion', () => {
    it('debería retornar la publicación si existe', async () => {
      mockPublicacionModel.findByPk.mockResolvedValue(mockPublicacion);

      const result = await service.validarPublicacion(1);

      expect(result).toEqual(mockPublicacion);
      expect(mockPublicacionModel.findByPk).toHaveBeenCalledWith(
        1,
        expect.any(Object),
      );
    });

    it('debería lanzar NotFoundException si no existe la publicación', async () => {
      mockPublicacionModel.findByPk.mockResolvedValue(null);

      await expect(service.validarPublicacion(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('debería llamar a verificarUsuarioDeRuta y retornar publicaciones para usuario normal', async () => {
      mockAccesoService.verificarUsuarioDeRuta.mockImplementation(() => {});
      mockPublicacionModel.findAll.mockResolvedValue([mockPublicacion]);

      const result = await service.findAll(mockPublicador.sub, mockPublicador);

      expect(mockAccesoService.verificarUsuarioDeRuta).toHaveBeenCalledWith(
        mockPublicador,
        mockPublicador.sub,
      );
      expect(mockPublicacionModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              where: { usuario_id: mockPublicador.sub },
            }),
          ]),
        }),
      );
      expect(result).toEqual([mockPublicacion]);
    });

    it('debería retornar todas las publicaciones para admin', async () => {
      mockAccesoService.verificarUsuarioDeRuta.mockImplementation(() => {});
      mockPublicacionModel.findAll.mockResolvedValue([mockPublicacion]);

      const result = await service.findAll(mockPublicador.sub, mockAdmin);

      expect(mockPublicacionModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              where: {},
            }),
          ]),
        }),
      );

      expect(result).toEqual([mockPublicacion]);
    });
  });

  describe('create', () => {
    it('debería crear una publicación correctamente', async () => {
      const createDto = {
        titulo: 'Nueva Publicación',
        descripcion: 'Nueva descripción',
        ubicacion: 'Bs. As.',
        contacto: '1122223333',
        mascota_id: 1,
      };

      const mockMascota = { id: 1, usuario_id: mockPublicador.sub };
      mockMascotaService.validarMascota.mockResolvedValue(mockMascota);
      mockPublicacionModel.create.mockResolvedValue(mockPublicacion);
      mockAccesoService.verificarUsuarioDeRuta.mockImplementation(() => {});
      mockAccesoService.verificarAcceso.mockImplementation(() => {});

      const result = await service.create(
        createDto,
        mockPublicador.sub,
        mockPublicador,
      );

      expect(mockMascotaService.validarMascota).toHaveBeenCalledWith(
        createDto.mascota_id,
      );
      expect(mockAccesoService.verificarAcceso).toHaveBeenCalledWith(
        mockPublicador,
        { usuario_id: mockMascota.usuario_id },
      );
      expect(mockPublicacionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          titulo: createDto.titulo,
          descripcion: createDto.descripcion,
          ubicacion: createDto.ubicacion,
          contacto: createDto.contacto,
          mascota_id: mockMascota.id,
          estado: EstadoPublicacion.Abierta,
        }),
      );

      expect(result).toEqual(mockPublicacion);
    });
  });

  describe('update', () => {
    it('debería actualizar la publicación si usuario es admin y estado es correcto', async () => {
      const updateDto = {
        titulo: 'Nueva Publicación',
        descripcion: 'Nueva descripción',
        ubicacion: 'Bs. As.',
        contacto: '1122223333',
        // Se agrega para simular publicación
        publicado: new Date('2025-06-19T10:00:00Z'),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPublicacion);
      mockPublicacion.estado = EstadoPublicacion.Abierta;
      mockPublicacion.update = jest.fn().mockResolvedValue(mockPublicacion);

      const result = await service.update(
        1,
        updateDto,
        mockAdmin.sub,
        mockAdmin,
      );

      expect(result).toEqual(mockPublicacion);
      expect(mockPublicacion.update).toHaveBeenCalledWith(updateDto);
    });

    it('debería lanzar ForbiddenException si usuario no es admin y quiere publicar', async () => {
      const updateDto = {
        // Necesario para activar la validación
        publicado: new Date('2025-06-19T10:00:00Z'),
        titulo: 'Nuevo título',
        descripcion: 'descripción',
        ubicacion: 'Nueva ubicación',
        contacto: '1122223333',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPublicacion);
      mockPublicacion.estado = EstadoPublicacion.Abierta;

      await expect(
        service.update(1, updateDto, mockPublicador.sub, mockPublicador),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debería lanzar ForbiddenException si estado no es Abierta y se intenta cerrar', async () => {
      const updateDto = {
        titulo: 'Nuevo título',
        descripcion: 'descripción',
        ubicacion: 'Nueva ubicación',
        contacto: '1122223333',
        estado: EstadoPublicacion.Cerrada,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPublicacion);
      mockPublicacion.estado = EstadoPublicacion.Cerrada;

      await expect(
        service.update(1, updateDto, mockAdmin.sub, mockAdmin),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('debería eliminar la publicación', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPublicacion);
      mockPublicacion.destroy();

      await service.remove(1, mockPublicador.sub, mockPublicador);

      expect(mockPublicacion.destroy).toHaveBeenCalled();
    });
  });

  describe('findPublicadasYAbiertas', () => {
    it('debería devolver publicaciones abiertas y publicadas', async () => {
      mockPublicacionModel.findAll.mockResolvedValue([mockPublicacion]);

      const result = await service.findPublicadasYAbiertas();

      expect(mockPublicacionModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: EstadoPublicacion.Abierta,
            publicado: { [Op.not]: null },
          },
        }),
      );

      expect(result).toEqual([mockPublicacion]);
    });
  });

  describe('findOnePublicada', () => {
    it('debería devolver una publicación abierta y publicada', async () => {
      mockPublicacionModel.findOne.mockResolvedValue(mockPublicacion);

      const result = await service.findOnePublicada(1);

      expect(mockPublicacionModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
            estado: EstadoPublicacion.Abierta,
            publicado: { [Op.not]: null },
          },
        }),
      );

      expect(result).toEqual(mockPublicacion);
    });

    it('debería lanzar NotFoundException si no existe publicación abierta y publicada', async () => {
      mockPublicacionModel.findOne.mockResolvedValue(null);

      await expect(service.findOnePublicada(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findPublicadasYAbiertasConFiltros', () => {
    it('debería devolver publicaciones abiertas y publicadas SIN filtro de texto', async () => {
      const mockFindAndCount = {
        count: 2,
        rows: [mockPublicacion, mockPublicacion],
      };

      const params = {
        page: 1,
        limit: 10,
        sortBy: 'titulo',
        sortOrder: 'asc',
      };

      mockPublicacionModel.findAndCountAll.mockResolvedValue(mockFindAndCount);

      const result = await service.findPublicadasYAbiertasConFiltros(
        params as any,
      );

      expect(mockPublicacionModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: EstadoPublicacion.Abierta,
            publicado: { [Op.not]: null },
          },
          limit: 10,
          offset: 0,
          order: [['titulo', 'asc']],
          include: expect.any(Array),
        }),
      );

      expect(result).toEqual({
        publicaciones: mockFindAndCount.rows,
        total: mockFindAndCount.count,
        totalPages: Math.ceil(mockFindAndCount.count / 10),
      });
    });

    it('debería devolver publicaciones abiertas y publicadas CON filtro de texto', async () => {
      const mockFindAndCount = {
        count: 1,
        rows: [mockPublicacion],
      };

      const params = {
        q: 'Test',
        page: 2,
        limit: 5,
        sortBy: 'titulo',
        sortOrder: 'desc',
      };

      mockPublicacionModel.findAndCountAll.mockResolvedValue(mockFindAndCount);

      const result = await service.findPublicadasYAbiertasConFiltros(
        params as any,
      );

      expect(mockPublicacionModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: EstadoPublicacion.Abierta,
            publicado: { [Op.not]: null },
            [Op.or]: [
              { titulo: { [Op.iLike]: '%Test%' } },
              { descripcion: { [Op.iLike]: '%Test%' } },
              { ubicacion: { [Op.iLike]: '%Test%' } },
            ],
          },
          limit: 5,
          offset: 5,
          order: [['titulo', 'desc']],
          include: expect.any(Array),
        }),
      );

      expect(result).toEqual({
        publicaciones: mockFindAndCount.rows,
        total: mockFindAndCount.count,
        totalPages: Math.ceil(mockFindAndCount.count / 5),
      });
    });
  });

  describe('findPublicacionesConFiltros', () => {
    it('debería devolver publicaciones filtradas con paginación', async () => {
      mockAccesoService.verificarUsuarioDeRuta.mockReturnValue(undefined);
      const mockFindAndCount = {
        count: 15,
        rows: [mockPublicacion, mockPublicacion],
      };

      mockPublicacionModel.findAndCountAll.mockResolvedValue(mockFindAndCount);

      const params = {
        q: 'test',
        page: 1,
        limit: 2,
        sortBy: 'titulo',
        sortOrder: 'asc',
      };

      const result = await service.findPublicacionesConFiltros(
        1,
        mockPublicador,
        params as any,
      );

      expect(mockPublicacionModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
          limit: 2,
          offset: 0,
          order: [['titulo', 'asc']],
          include: expect.any(Array),
        }),
      );

      expect(result).toEqual({
        publicaciones: mockFindAndCount.rows,
        total: mockFindAndCount.count,
        totalPages: Math.ceil(mockFindAndCount.count / params.limit),
      });
    });
  });
});
