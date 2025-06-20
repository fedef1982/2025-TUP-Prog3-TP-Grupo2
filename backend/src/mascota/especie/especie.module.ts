import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Especie } from './especie.model';
import { EspecieService } from './especie.service';
import { EspecieController } from './especie.controller';

@Module({
  imports: [SequelizeModule.forFeature([Especie])],
  controllers: [EspecieController],
  providers: [EspecieService],
  exports: [EspecieService],
})
export class EspecieModule {}
