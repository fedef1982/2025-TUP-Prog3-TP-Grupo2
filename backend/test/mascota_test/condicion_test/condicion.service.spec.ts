import { Test, TestingModule } from '@nestjs/testing';
import { CondicionService } from '../../../src/mascota/condicion/condicion.service';
import { Condicion } from '../../../src/mascota/condicion/condicion.model';
import { NotFoundException } from '@nestjs/common';

describe('CondicionService', () => {
  let service: CondicionService;
  let condicionModel: typeof Condicion;

  const mockCondicionModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CondicionService,
        {
          provide: 'CondicionRepository', 
          useValue: mockCondicionModel,
        },
        {
          provide: Condicion,
          useValue: mockCondicionModel,
        },
      ],
    })
    .compile();

    service = module.get<CondicionService>(CondicionService);
    condicionModel = module.get<typeof Condicion>(Condicion);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar un array de condiciones', async () => {
      const condicionesArray = [{ id: 1 }, { id: 2 }];
      mockCondicionModel.findAll.mockResolvedValue(condicionesArray);

      const result = await service.findAll();

      expect(condicionModel.findAll).toHaveBeenCalled();
      expect(result).toBe(condicionesArray);
    });
  });

  describe('validarCondicion', () => {
    it('debería lanzar NotFoundException si no existe la condición', async () => {
      mockCondicionModel.findByPk.mockResolvedValue(null);

      await expect(service.validarCondicion(1)).rejects.toThrow(NotFoundException);
      expect(condicionModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('no debería lanzar excepción si la condición existe', async () => {
      const condicion = { id: 1 };
      mockCondicionModel.findByPk.mockResolvedValue(condicion);

      await expect(service.validarCondicion(1)).resolves.toBeUndefined();
      expect(condicionModel.findByPk).toHaveBeenCalledWith(1);
    });
  });
});
