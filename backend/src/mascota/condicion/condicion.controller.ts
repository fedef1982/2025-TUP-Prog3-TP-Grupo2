import { Controller, Get } from '@nestjs/common';
import { CondicionService } from './condicion.service';
import { Condicion } from './condicion.model';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/roles.enum';
import { DocGetCondicion } from './condicion.doc';


@Controller('condiciones')
export class CondicionController {
  constructor(private readonly condicionService: CondicionService) {}

  @DocGetCondicion()
  @Get()
  @Roles(Role.ADMIN, Role.PUBLICADOR)
  findAll(): Promise<Condicion[]> {
    return this.condicionService.findAll();
  }
}
