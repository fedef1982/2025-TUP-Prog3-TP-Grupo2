import { Controller, Get } from '@nestjs/common';
import { CondicionService } from './condicion.service';
import { Condicion } from './condicion.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { DocGetCondicion } from './condicion.doc';

@Controller('condiciones')
export class CondicionController {
  constructor(private readonly condicionService: CondicionService) {}

  @DocGetCondicion()
  @Get()
  @Roles(Role.PUBLICADOR)
  findAll(): Promise<Condicion[]> {
    return this.condicionService.findAll();
  }
}
