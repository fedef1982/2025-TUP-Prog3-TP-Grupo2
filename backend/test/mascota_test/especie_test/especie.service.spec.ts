import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EspecieService } from '../../../src/mascota/especie/especie.service';
import { Especie } from '../../../src/mascota/especie/especie.model';

describe('EspecieService', () => {
  let service: EspecieService;

  const mockEspecieModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspecieService,
        {
          provide: 'EspecieRepository', 
          useValue: mockEspecieModel,
        },
      ],
    })
    .overrideProvider('EspecieRepository')
    .useValue(mockEspecieModel)
    .compile();

    service = module.get<EspecieService>(EspecieService);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('findAll', () => {
    it('debería retornar un array de especies', async () => {
      const especiesArray = [{ id: 1, nombre: 'Canino' }, { id: 2, nombre: 'Felino' }] as Especie[];
      mockEspecieModel.findAll.mockResolvedValue(especiesArray);

      const result = await service.findAll();

      expect(mockEspecieModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(especiesArray);
    });
  });

  describe('validarEspecie', () => {
    it('no debería lanzar error si la especie existe', async () => {
      const especieMock = { id: 1, nombre: 'Canino' } as Especie;
      mockEspecieModel.findByPk.mockResolvedValue(especieMock);

      await expect(service.validarEspecie(1)).resolves.toBeUndefined();
      expect(mockEspecieModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('debería lanzar NotFoundException si la especie no existe', async () => {
      mockEspecieModel.findByPk.mockResolvedValue(null);

      await expect(service.validarEspecie(999)).rejects.toThrow(NotFoundException);
      await expect(service.validarEspecie(999)).rejects.toThrow('La especie con id 999 no existe');
      expect(mockEspecieModel.findByPk).toHaveBeenCalledWith(999);
    });
  });
});
