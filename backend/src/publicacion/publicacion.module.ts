import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Publicacion } from './publicacion.model';
import { PublicacionesService } from './publicacion.service';
import { PublicacionesController } from './publicacion.controller';
import { Mascota } from '../mascota/mascota.model';
import { AccesoModule } from '../acceso/acceso.module';
import { Especie } from '../mascota/especie.model';
import { Condicion } from '../mascota/condicion.model';
import { User } from '../usuario/usuario.model';
import { MascotaModule } from '../mascota/mascota.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Publicacion,
      Mascota,
      Especie,
      Condicion,
      User,
    ]),
    AccesoModule,
    MascotaModule,
  ],
  providers: [PublicacionesService],
  exports: [PublicacionesService],
  controllers: [PublicacionesController],
})
export class PublicacionModule {}
