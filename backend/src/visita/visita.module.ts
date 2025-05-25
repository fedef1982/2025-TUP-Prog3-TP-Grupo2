/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Visita } from './visita.model';
import { VisitaService } from './visita.service';
import { VisitaController } from './visita.controller';

@Module({
  imports: [SequelizeModule.forFeature([Visita])],
  providers: [VisitaService],
  controllers: [VisitaController],
})
export class VisitaModule {}