import { Module } from '@nestjs/common';
import { AccesoService } from './acceso.service';

@Module({
  providers: [AccesoService],
  exports: [AccesoService],
})
export class AccesoModule {}
