import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenido a la API de AdoptAR! Puedes ver la documentación en http://localhost:3001/api';
  }
}
