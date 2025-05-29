import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Publicacion } from './publicacion.model';
import { PublicacionesService } from './publicacion.service';
import { PublicacionesController } from './publicacion.controller';
import { Mascota } from 'src/mascota/mascota.model';

@Module({
  imports: [SequelizeModule.forFeature([Publicacion, Mascota])],
  providers: [PublicacionesService],
  controllers: [PublicacionesController],
})
export class PublicacionModule {}
