import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EspecieService } from '../../../src/mascota/especie/especie.service';
import { Especie } from '../../../src/mascota/especie/especie.model';

describe('EspecieService', () => {
  let service: EspecieService;
  let especieModel: typeof Especie;

  // Mock del modelo Especie
  const mockEspecieModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspecieService,
        { // Token 
          provide: 'EspecieRepository', 
          useValue: mockEspecieModel,
        },
        {
          provide: Especie,
          useValue: mockEspecieModel,
        },
      ],
    })
    .compile();

    service = module.get<EspecieService>(EspecieService);
    especieModel = module.get<typeof Especie>(Especie);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar un array de especies', async () => {
      const especiesArray = [{ id: 1, nombre: 'Canina' }, { id: 2, nombre: 'Felina' }];
      mockEspecieModel.findAll.mockResolvedValue(especiesArray);

      const result = await service.findAll();

      expect(mockEspecieModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(especiesArray);
    });
  });

  describe('validarEspecie', () => {
    it('no debería lanzar error si la especie existe', async () => {
      const especie = { id: 1, nombre: 'Canina' };
      mockEspecieModel.findByPk.mockResolvedValue(especie);

      await expect(service.validarEspecie(1)).resolves.toBeUndefined();
      expect(mockEspecieModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('debería lanzar NotFoundException si la especie no existe', async () => {
      mockEspecieModel.findByPk.mockResolvedValue(null);

      await expect(service.validarEspecie(9)).rejects.toThrow(NotFoundException);
      expect(mockEspecieModel.findByPk).toHaveBeenCalledWith(9);
    });
  });
});
