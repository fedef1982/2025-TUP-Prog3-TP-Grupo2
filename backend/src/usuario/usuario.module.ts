import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './usuario.model';
import { UsersService } from './usuario.service';
import { UsersController } from './usuario.controller';
import { Rol } from './rol.model';
import { Mascota } from '../mascota/mascota.model';
import { Publicacion } from '../publicacion/publicacion.model';
import { Visita } from '../visita/visita.model';
import { AccesoModule } from '../acceso/acceso.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Rol, Mascota, Publicacion, Visita]),
    AccesoModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}
