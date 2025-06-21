import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Mensaje de bienvenida de la API' })
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
