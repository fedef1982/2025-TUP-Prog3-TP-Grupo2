import { Test, TestingModule } from '@nestjs/testing';
import { CondicionController } from '../../../src/mascota/condicion/condicion.controller';
import { CondicionService } from '../../../src/mascota/condicion/condicion.service';
import { Condicion } from '../../../src/mascota/condicion/condicion.model';

describe('CondicionController', () => {
  let condicionController: CondicionController;
  let condicionService: CondicionService;

  beforeEach(async () => {
    const mockCondicionService = {
      findAll: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CondicionController],
      providers: [
        {
          provide: CondicionService,
          useValue: mockCondicionService,
        },
      ],
    }).compile();

    condicionService = moduleRef.get<CondicionService>(CondicionService);
    condicionController = moduleRef.get<CondicionController>(CondicionController);
  });

  describe('findAll', () => {
    it('should return an array of condiciones', async () => {
      const result: Condicion[] = [
        { id: 1, nombre: 'Condicion 1' } as Condicion,
        { id: 2, nombre: 'Condicion 2' } as Condicion,
      ];

      // Mockeamos la implementación de findAll para que retorne result
      jest.spyOn(condicionService, 'findAll').mockResolvedValue(result);

      // Ejecutamos el método del controlador y verificamos el resultado
      expect(await condicionController.findAll()).toBe(result);

      // Verificamos que el servicio fue llamado una vez
      expect(condicionService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
