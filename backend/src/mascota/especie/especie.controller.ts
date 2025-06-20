import { Controller, Get } from '@nestjs/common';
import { EspecieService } from './especie.service';
import { Especie } from './especie.model';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/roles.enum';

@Controller('especies')
export class EspecieController {
  constructor(private readonly especieService: EspecieService) {}

  @Get()
  @Roles(Role.PUBLICADOR)
  findAll(): Promise<Especie[]> {
    return this.especieService.findAll();
  }
}
