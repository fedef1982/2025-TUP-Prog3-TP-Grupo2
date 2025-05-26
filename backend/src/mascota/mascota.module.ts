import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mascota } from './mascota.model';
import { MascotaService } from './mascota.service';
import { MascotasController } from './mascota.controller';
import { Especie } from './especie.model';
import { Condicion } from './condicion.model';
import { User } from 'src/usuario/usuario.model';

@Module({
  imports: [SequelizeModule.forFeature([Mascota, Especie, Condicion, User])],
  providers: [MascotaService],
  controllers: [MascotasController],
})
export class MascotaModule {}
