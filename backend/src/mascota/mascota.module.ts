import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mascota } from './mascota.model';
import { MascotaService } from './mascota.service';
import { MascotasController } from './mascota.controller';
import { Especie } from './especie.model';
import { Condicion } from './condicion.model';
import { User } from 'src/usuario/usuario.model';
import { AccesoModule } from 'src/acceso/acceso.module';

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
