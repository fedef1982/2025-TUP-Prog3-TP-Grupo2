import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mascota } from './mascota.model';
import { MascotaService } from './mascota.service';
import { MascotasController } from './mascota.controller';
import { Especie } from './especie/especie.model';
import { Condicion } from './condicion/condicion.model';
import { User } from '../usuario/usuario.model';
import { AccesoModule } from '../acceso/acceso.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Mascota, User, Especie, Condicion]),
    AccesoModule,
  ],
  providers: [MascotaService],
  exports: [MascotaService],
  controllers: [MascotasController],
})
export class MascotaModule {}
