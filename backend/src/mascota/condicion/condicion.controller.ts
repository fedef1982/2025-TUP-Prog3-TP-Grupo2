import { Controller, Get } from '@nestjs/common';
import { CondicionService } from './condicion.service';
import { Condicion } from './condicion.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@Controller('condiciones')
export class CondicionController {
  constructor(private readonly condicionService: CondicionService) {}

  @Get()
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findAll(): Promise<Condicion[]> {
    return this.condicionService.findAll();
  }
}
