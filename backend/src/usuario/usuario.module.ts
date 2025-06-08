import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './usuario.model';
import { UsersService } from './usuario.service';
import { UsersController } from './usuario.controller';
import { Rol } from './rol.model';
import { AccesoModule } from 'src/acceso/acceso.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Rol]), AccesoModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}
