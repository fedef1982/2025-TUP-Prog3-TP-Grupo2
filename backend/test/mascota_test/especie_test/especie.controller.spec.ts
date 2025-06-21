import { Test, TestingModule } from '@nestjs/testing';
import { EspecieController } from '../../../src/mascota/especie/especie.controller';
import { EspecieService } from '../../../src/mascota/especie/especie.service';
import { Especie } from '../../../src/mascota/especie/especie.model';

describe('EspecieController', () => {
  let especieController: EspecieController;
  let especieService: EspecieService;

  beforeEach(async () => {
    const mockEspecieService = {
      findAll: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [EspecieController],
      providers: [
        {
          provide: EspecieService,
          useValue: mockEspecieService,
        },
      ],
    }).compile();

    especieService = moduleRef.get<EspecieService>(EspecieService);
    especieController = moduleRef.get<EspecieController>(EspecieController);
  });

  describe('findAll', () => {
    it('debería retornar un arreglo de especies', async () => {
      const result: Especie[] = [
        { id: 1, nombre: 'Canino' } as Especie,
        { id: 2, nombre: 'Felino' } as Especie,
      ];

      jest.spyOn(especieService, 'findAll').mockResolvedValue(result);

      expect(await especieController.findAll()).toBe(result);
      expect(especieService.findAll).toHaveBeenCalled();
    });
  });
});
