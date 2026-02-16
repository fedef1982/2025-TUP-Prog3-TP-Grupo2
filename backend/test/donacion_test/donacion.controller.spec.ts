// donacion.controller.spec.ts (unit test)
import { Test, TestingModule } from '@nestjs/testing';
import { DonacionController } from '../../src/donacion/donacion.controller';
import { DonacionService } from '../../src/donacion/donacion.service';
import { AccesoService } from '../../src/acceso/acceso.service';

describe('DonacionController', () => {
  let controller: DonacionController;

  const donacionServiceMock = {
    findAll: jest.fn(),
    findDonacionesConFiltros: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findOneByUser: jest.fn(),
  };

  const accesoServiceMock = {
    // el controller no lo usa directo, pero se inyecta
  };

  const reqMock = (userOverrides: Partial<any> = {}) =>
    ({
      user: {
        sub: 2,
        email: 'pub@x.com',
        rol_id: 2,
        ...userOverrides,
      },
    } as any);

  const donacionMock = (overrides: Partial<any> = {}) =>
    ({
      id: 10,
      usuario_id: 2,
      alias: 'carlos.alias',
      entidad_financiera: 'Banco X',
      ...overrides,
    } as any);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonacionController],
      providers: [
        { provide: DonacionService, useValue: donacionServiceMock },
        { provide: AccesoService, useValue: accesoServiceMock },
      ],
    }).compile();

    controller = module.get<DonacionController>(DonacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería delegar en donacionService.findAll(usuarioId, req.user)', async () => {
      const usuarioId = 2;
      const req = reqMock();
      const expected = [donacionMock()];

      donacionServiceMock.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(usuarioId, req);

      expect(donacionServiceMock.findAll).toHaveBeenCalledWith(usuarioId, req.user);
      expect(result).toBe(expected);
    });
  });

  describe('findDonacionesConFiltros', () => {
    it('debería delegar en donacionService.findDonacionesConFiltros(usuarioId, req.user, params)', async () => {
      const usuarioId = 2;
      const req = reqMock();
      const params = { q: 'car', page: 1, limit: 10, sortBy: 'alias', sortOrder: 'asc' } as any;

      const expected = { donaciones: [donacionMock()], total: 1, totalPages: 1 };
      donacionServiceMock.findDonacionesConFiltros.mockResolvedValue(expected);

      const result = await controller.findDonacionesConFiltros(usuarioId, req, params);

      expect(donacionServiceMock.findDonacionesConFiltros).toHaveBeenCalledWith(
        usuarioId,
        req.user,
        params,
      );
      expect(result).toBe(expected);
    });
  });

  describe('create', () => {
    it('debería delegar en donacionService.create(dto, usuarioId, req.user)', async () => {
      const usuarioId = 2;
      const req = reqMock();
      const dto = {
        entidad_financiera: 'Banco Galicia',
        alias: 'carlos.galicia',
        destinatario: 'Carlos Perez',
      } as any;

      const expected = donacionMock({ id: 99, alias: dto.alias });
      donacionServiceMock.create.mockResolvedValue(expected);

      const result = await controller.create(dto, usuarioId, req);

      expect(donacionServiceMock.create).toHaveBeenCalledWith(dto, usuarioId, req.user);
      expect(result).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('debería delegar en donacionService.findOne(donacionId, usuarioId, req.user)', async () => {
      const usuarioId = 2;
      const donacionId = 10;
      const req = reqMock();

      const expected = donacionMock({ id: donacionId });
      donacionServiceMock.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(usuarioId, donacionId, req);

      expect(donacionServiceMock.findOne).toHaveBeenCalledWith(donacionId, usuarioId, req.user);
      expect(result).toBe(expected);
    });
  });

  describe('update', () => {
    it('debería delegar en donacionService.update(donacionId, dto, usuarioId, req.user)', async () => {
      const usuarioId = 2;
      const donacionId = 10;
      const req = reqMock();

      const dto = { alias: 'nuevo.alias' } as any;
      const expected = donacionMock({ id: donacionId, alias: dto.alias });

      donacionServiceMock.update.mockResolvedValue(expected);

      const result = await controller.update(usuarioId, donacionId, dto, req);

      expect(donacionServiceMock.update).toHaveBeenCalledWith(
        donacionId,
        dto,
        usuarioId,
        req.user,
      );
      expect(result).toBe(expected);
    });
  });

  describe('remove', () => {
    it('debería delegar en donacionService.remove(donacionId, usuarioId, req.user)', async () => {
      const usuarioId = 2;
      const donacionId = 10;
      const req = reqMock();

      donacionServiceMock.remove.mockResolvedValue(undefined);

      const result = await controller.remove(usuarioId, donacionId, req);

      expect(donacionServiceMock.remove).toHaveBeenCalledWith(donacionId, usuarioId, req.user);
      expect(result).toBeUndefined();
    });
  });

  describe('findOneByUser', () => {
    it('debería delegar en donacionService.findOneByUser(usuarioId)', async () => {
      const usuarioId = 7;
      const expected = donacionMock({ usuario_id: usuarioId });

      donacionServiceMock.findOneByUser.mockResolvedValue(expected);

      const result = await controller.findOneByUser(usuarioId);

      expect(donacionServiceMock.findOneByUser).toHaveBeenCalledWith(usuarioId);
      expect(result).toBe(expected);
    });
  });
});
