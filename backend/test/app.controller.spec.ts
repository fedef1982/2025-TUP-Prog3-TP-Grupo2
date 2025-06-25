import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Bienvenido a la API de AdoptAR!"', () => {
      expect(appController.getHello()).toBe(
        'Bienvenido a la API de AdoptAR! Puedes ver la documentación en http://localhost:3001/api',
      );
    });
  });
});
