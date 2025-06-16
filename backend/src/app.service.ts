import { Injectable } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Injectable()
export class AppService {
  @ApiOperation({ summary: 'Mensaje de bienvenida de la API' })
  getHello(): string {
    return 'Bienvenido a la API de AdoptAR! Puedes ver la documentación en http://localhost:3001/api';
  }
}
