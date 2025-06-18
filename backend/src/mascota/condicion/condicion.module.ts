import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Condicion } from './condicion.model';
import { CondicionService } from './condicion.service';
import { CondicionController } from './condicion.controller';

@Module({
  imports: [SequelizeModule.forFeature([Condicion])],
  controllers: [CondicionController],
  providers: [CondicionService],
  exports: [CondicionService],
})
export class CondicionModule {}
