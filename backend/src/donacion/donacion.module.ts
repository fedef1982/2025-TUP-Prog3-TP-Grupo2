import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Donacion } from './donacion.model';
import { DonacionService } from './donacion.service';
import { DonacionController } from './donacion.controller';
import { User } from '../../src/usuario/usuario.model';
import { AccesoModule } from '../../src/acceso/acceso.module';

@Module({
  imports: [SequelizeModule.forFeature([Donacion, User]), AccesoModule],
  providers: [DonacionService],
  exports: [DonacionService],
  controllers: [DonacionController],
})
export class DonacionModule {}
