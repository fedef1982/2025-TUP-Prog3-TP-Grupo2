import { Controller, Get } from '@nestjs/common';
import { EspecieService } from './especie.service';
import { Especie } from './especie.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { DocGetEspecie } from './especie.doc';

@Controller('especies')
export class EspecieController {
  constructor(private readonly especieService: EspecieService) {}

  @DocGetEspecie()
  @Get()
  @Roles(Role.PUBLICADOR)
  findAll(): Promise<Especie[]> {
    return this.especieService.findAll();
  }
}
