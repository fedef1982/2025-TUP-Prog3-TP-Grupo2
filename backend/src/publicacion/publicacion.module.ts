import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './publicacion.model';
import { UsersService } from './publicacion.service';
import { UsersController } from './publicacion.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UserModule {}
