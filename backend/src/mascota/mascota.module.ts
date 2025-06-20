import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mascota } from './mascota.model';
import { MascotaService } from './mascota.service';
import { MascotasController } from './mascota.controller';
import { Especie } from './especie/especie.model';
import { Condicion } from './condicion/condicion.model';
import { User } from 'src/usuario/usuario.model';
import { AccesoModule } from 'src/acceso/acceso.module';
import { EspecieModule } from './especie/especie.module';
import { CondicionModule } from './condicion/condicion.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Mascota, User, Especie, Condicion]),
    AccesoModule,
    EspecieModule,
    CondicionModule,
  ],
  providers: [MascotaService],
  exports: [MascotaService],
  controllers: [MascotasController],
})
export class MascotaModule {}
