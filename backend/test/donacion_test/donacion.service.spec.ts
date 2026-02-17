// donacion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { DonacionService } from '../../src/donacion/donacion.service';
import { Donacion } from '../../src/donacion/donacion.model';
import { User } from '../../src/usuario/usuario.model';
import { AccesoService } from '../../src/acceso/acceso.service';
import { Role } from '../../src/auth/roles.enum';

describe('DonacionService', () => {
  let service: DonacionService;

  // Mocks
  const donacionModelMock = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAndCountAll: jest.fn(),
  };

  const userModelMock = {};

  const accesoServiceMock = {
    verificarUsuarioDeRuta: jest.fn(),
    verificarAcceso: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonacionService,
        { provide: getModelToken(Donacion), useValue: donacionModelMock },
        { provide: getModelToken(User), useValue: userModelMock },
        { provide: AccesoService, useValue: accesoServiceMock },
      ],
    }).compile();

    service = module.get<DonacionService>(DonacionService);
  });

  const adminJwt = { sub: 1, rol_id: Number(Role.ADMIN), email: 'admin@x.com' } as any;
  const pubJwt = { sub: 2, rol_id: Number(Role.PUBLICADOR), email: 'pub@x.com' } as any;

  const makeDonacionInstance = (overrides: Partial<any> = {}) => ({
    id: 10,
    usuario_id: 2,
    destinatario: 'Carlos',
    alias: 'carlos.alias',
    update: jest.fn(),
    destroy: jest.fn(),
    ...overrides,
  });

  describe('findAll', () => {
    it('ADMIN: debería traer todas las donaciones (where vacío) e incluir User', async () => {
      const rows = [makeDonacionInstance({ usuario_id: 99 })];
      donacionModelMock.findAll.mockResolvedValue(rows);

      const result = await service.findAll(1, adminJwt);

      expect(accesoServiceMock.verificarUsuarioDeRuta).toHaveBeenCalledWith(adminJwt, 1);
      expect(donacionModelMock.findAll).toHaveBeenCalledWith({
        where: {},
        include: [User],
      });
      expect(result).toEqual(rows);
    });

    it('PUBLICADOR: debería filtrar por usuario_id = usuario.sub e incluir User', async () => {
      const rows = [makeDonacionInstance({ usuario_id: pubJwt.sub })];
      donacionModelMock.findAll.mockResolvedValue(rows);

      const result = await service.findAll(2, pubJwt);

      expect(accesoServiceMock.verificarUsuarioDeRuta).toHaveBeenCalledWith(pubJwt, 2);
      expect(donacionModelMock.findAll).toHaveBeenCalledWith({
        where: { usuario_id: pubJwt.sub },
        include: [User],
      });
      expect(result).toEqual(rows);
    });
  });

  describe('validarDonacion', () => {
    it('debería devolver la donación cuando existe (incluyendo User)', async () => {
      const donacion = makeDonacionInstance();
      donacionModelMock.findByPk.mockResolvedValue(donacion);

      const result = await service.validarDonacion(10);

      expect(donacionModelMock.findByPk).toHaveBeenCalledWith(10, { include: [User] });
      expect(result).toBe(donacion);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      donacionModelMock.findByPk.mockResolvedValue(null);

      await expect(service.validarDonacion(999)).rejects.toBeInstanceOf(NotFoundException);
      await expect(service.validarDonacion(999)).rejects.toThrow('La donacion con ID 999 no existe');
    });
  });

  describe('findOneByUser', () => {
    it('debería devolver la primera donación del usuario', async () => {
      const d1 = makeDonacionInstance({ id: 1, usuario_id: 7 });
      const d2 = makeDonacionInstance({ id: 2, usuario_id: 7 });
      donacionModelMock.findAll.mockResolvedValue([d1, d2]);

      const result = await service.findOneByUser(7);

      expect(donacionModelMock.findAll).toHaveBeenCalledWith({ where: { usuario_id: 7 } });
      expect(result).toBe(d1);
    });

    it('si findAll devuelve null/undefined, debería lanzar NotFoundException', async () => {
      // Nota: con Sequelize normalmente devuelve [], no null.
      donacionModelMock.findAll.mockResolvedValue(null);

      await expect(service.findOneByUser(7)).rejects.toBeInstanceOf(NotFoundException);
      await expect(service.findOneByUser(7)).rejects.toThrow('La donacion con usuario ID 7 no existe');
    });
  });

  describe('findOne', () => {
    it('debería validar ruta, validar donación, verificar acceso y devolver donación', async () => {
      const donacion = makeDonacionInstance({ usuario_id: pubJwt.sub });
      jest.spyOn(service, 'validarDonacion').mockResolvedValue(donacion as any);

      const result = await service.findOne(10, 2, pubJwt);

      expect(accesoServiceMock.verificarUsuarioDeRuta).toHaveBeenCalledWith(pubJwt, 2);
      expect(service.validarDonacion).toHaveBeenCalledWith(10);
      expect(accesoServiceMock.verificarAcceso).toHaveBeenCalledWith(pubJwt, donacion);
      expect(result).toBe(donacion);
    });
  });

  describe('create', () => {
    it('debería validar usuario de ruta y crear donación asociada al usuario.sub', async () => {
      const dto = {
        destinatario: 'Carlos Perez',
        cbu: '123',
        cuit: '20-123',
        entidad_financiera: 'Banco X',
        tipo_cuenta: 'CA',
        alias: 'carlos.x',
        link_pago: 'https://x',
        motivo_donacion: 'ayuda',
      } as any;

      const created = makeDonacionInstance({ id: 55, usuario_id: pubJwt.sub });
      donacionModelMock.create.mockResolvedValue(created);

      const result = await service.create(dto, 2, pubJwt);

      expect(accesoServiceMock.verificarUsuarioDeRuta).toHaveBeenCalledWith(pubJwt, 2);
      expect(donacionModelMock.create).toHaveBeenCalledWith({
        destinatario: dto.destinatario,
        cbu: dto.cbu,
        cuit: dto.cuit,
        entidad_financiera: dto.entidad_financiera,
        tipo_cuenta: dto.tipo_cuenta,
        alias: dto.alias,
        link_pago: dto.link_pago,
        motivo_donacion: dto.motivo_donacion,
        usuario_id: pubJwt.sub,
      });
      expect(result).toBe(created);
    });
  });

  describe('update', () => {
    it('debería llamar findOne y luego donacion.update(dto) y retornar la instancia', async () => {
    const donacion = makeDonacionInstance();
    jest.spyOn(service, 'findOne').mockResolvedValue(donacion as any);

    donacion.update.mockResolvedValue(undefined);

    const dto = { alias: 'nuevo.alias' } as any;

    const result = await service.update(10, dto, 2, pubJwt);

    expect(service.findOne).toHaveBeenCalledWith(10, 2, pubJwt);
    expect(donacion.update).toHaveBeenCalledWith(dto);
    expect(result).toBe(donacion);
    });
  });

  describe('remove', () => {
    it('debería llamar findOne y luego donacion.destroy()', async () => {
      const donacion = makeDonacionInstance();
      jest.spyOn(service, 'findOne').mockResolvedValue(donacion as any);
      donacion.destroy.mockResolvedValue(undefined);

      await expect(service.remove(10, 2, pubJwt)).resolves.toBeUndefined();

      expect(service.findOne).toHaveBeenCalledWith(10, 2, pubJwt);
      expect(donacion.destroy).toHaveBeenCalled();
    });
  });

  describe('findDonacionesConFiltros', () => {
    it('ADMIN: debería usar where {} y retornar paginación', async () => {
      const params = { page: 2, limit: 10, sortBy: 'alias', sortOrder: 'desc' } as any;
      donacionModelMock.findAndCountAll.mockResolvedValue({
        count: 25,
        rows: [makeDonacionInstance(), makeDonacionInstance({ id: 11 })],
      });

      const result = await service.findDonacionesConFiltros(1, adminJwt, params);

      expect(accesoServiceMock.verificarUsuarioDeRuta).toHaveBeenCalledWith(adminJwt, 1);

      expect(donacionModelMock.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 10, // (page-1)*limit = (2-1)*10
        order: [['alias', 'desc']],
        include: [User],
      });

      expect(result).toEqual({
        donaciones: expect.any(Array),
        total: 25,
        totalPages: 3, // ceil(25/10)
      });
    });

    it('PUBLICADOR: debería filtrar por usuario_id y agregar búsqueda por q (destinatario o alias)', async () => {
      const params = { q: 'car', page: 1, limit: 5, sortBy: 'alias', sortOrder: 'asc' } as any;

      donacionModelMock.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [makeDonacionInstance({ destinatario: 'Carlos', alias: 'carlos.alias', usuario_id: pubJwt.sub })],
      });

      const result = await service.findDonacionesConFiltros(2, pubJwt, params);

      expect(accesoServiceMock.verificarUsuarioDeRuta).toHaveBeenCalledWith(pubJwt, 2);

      // Capturamos el argumento para validar estructura sin depender del shape interno de Sequelize
      const callArg = donacionModelMock.findAndCountAll.mock.calls[0][0];

      expect(callArg.limit).toBe(5);
      expect(callArg.offset).toBe(0);
      expect(callArg.order).toEqual([['alias', 'asc']]);
      expect(callArg.include).toEqual([User]);

      expect(callArg.where.usuario_id).toBe(pubJwt.sub);
      expect(callArg.where[Op.or]).toBeDefined();
      expect(callArg.where[Op.or]).toEqual([
        { destinatario: { [Op.iLike]: `%car%` } },
        { alias: { [Op.iLike]: `%car%` } },
      ]);

      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.donaciones).toHaveLength(1);
    });
  });
});
