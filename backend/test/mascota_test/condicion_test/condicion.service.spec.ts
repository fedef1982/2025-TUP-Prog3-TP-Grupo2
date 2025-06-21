import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CondicionService } from '../../../src/mascota/condicion/condicion.service';
import { Condicion } from '../../../src/mascota/condicion/condicion.model';

describe('CondicionService', () => {
  let service: CondicionService;
  let condicionModel: typeof Condicion;

  // Mock del modelo Condicion
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
    }).compile();

    service = module.get<CondicionService>(CondicionService);
    condicionModel = module.get<typeof Condicion>(Condicion);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe retornar un array de condiciones', async () => {
      const condicionesArray = [{ id: 1 }, { id: 2 }];
      mockCondicionModel.findAll.mockResolvedValue(condicionesArray);

      const result = await service.findAll();

      expect(mockCondicionModel.findAll).toHaveBeenCalled();
      expect(result).toBe(condicionesArray);
    });
  });

  describe('validarCondicion', () => {
    it('debe lanzar NotFoundException si no existe la condición', async () => {
      mockCondicionModel.findByPk.mockResolvedValue(null);

      await expect(service.validarCondicion(1)).rejects.toThrow(NotFoundException);
      expect(mockCondicionModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('no debe lanzar error si la condición existe', async () => {
      const condicionExistente = { id: 1 };
      mockCondicionModel.findByPk.mockResolvedValue(condicionExistente);

      await expect(service.validarCondicion(1)).resolves.toBeUndefined();
      expect(mockCondicionModel.findByPk).toHaveBeenCalledWith(1);
    });
  });
});
