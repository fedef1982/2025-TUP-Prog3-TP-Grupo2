import { Controller, Get } from '@nestjs/common';
import { CondicionService } from './condicion.service';
import { Condicion } from './condicion.model';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/roles.enum';

@Controller('condiciones')
export class CondicionController {
  constructor(private readonly condicionService: CondicionService) {}

  @Get()
  @Roles(Role.PUBLICADOR)
  findAll(): Promise<Condicion[]> {
    return this.condicionService.findAll();
  }
}
