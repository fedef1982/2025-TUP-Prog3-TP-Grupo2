import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Visita } from './visita.model';
import { VisitaService } from './visita.service';
import { VisitaController } from './visita.controller';
import { Publicacion } from '../publicacion/publicacion.model';
import { AccesoModule } from '../acceso/acceso.module';
import { PublicacionModule } from '../publicacion/publicacion.module';
import { Mascota } from '../mascota/mascota.model';
import { Especie } from '../mascota/especie/especie.model';
import { Condicion } from '../mascota/condicion/condicion.model';
import { User } from '../usuario/usuario.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Visita,
      Publicacion,
      Mascota,
      Especie,
      Condicion,
      User,
    ]),
    AccesoModule,
    PublicacionModule,
  ],
  providers: [VisitaService],
  controllers: [VisitaController],
})
export class VisitaModule {}
