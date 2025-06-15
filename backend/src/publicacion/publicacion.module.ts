import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Publicacion } from './publicacion.model';
import { PublicacionesService } from './publicacion.service';
import { PublicacionesController } from './publicacion.controller';
import { Mascota } from 'src/mascota/mascota.model';
import { AccesoModule } from 'src/acceso/acceso.module';
import { Especie } from 'src/mascota/especie.model';
import { Condicion } from 'src/mascota/condicion.model';
import { User } from 'src/usuario/usuario.model';
import { MascotaModule } from 'src/mascota/mascota.module';

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
