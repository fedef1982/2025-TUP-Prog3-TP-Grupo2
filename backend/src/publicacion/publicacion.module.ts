import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Publicacion } from './publicacion.model';
import { PublicacionesService } from './publicacion.service';
import { PublicacionesController } from './publicacion.controller';

@Module({
  imports: [SequelizeModule.forFeature([Publicacion])],
  providers: [PublicacionesService],
  controllers: [PublicacionesController],
})
export class PublicacionModule {}
