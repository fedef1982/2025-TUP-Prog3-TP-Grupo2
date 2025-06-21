import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Visita } from './visita.model';
import { VisitaService } from './visita.service';
import { VisitaController } from './visita.controller';
import { Publicacion } from 'src/publicacion/publicacion.model';
import { AccesoModule } from 'src/acceso/acceso.module';
import { PublicacionModule } from 'src/publicacion/publicacion.module';
import { Mascota } from 'src/mascota/mascota.model';
import { Especie } from 'src/mascota/especie/especie.model';
import { Condicion } from 'src/mascota/condicion/condicion.model';
import { User } from 'src/usuario/usuario.model';

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
