import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './usuario/usuario.model';
import { UserModule } from './usuario/usuario.module';
import { Publicacion } from './publicacion/publicacion.model';
import { PublicacionModule } from './publicacion/publicacion.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'paola',
      database: 'adoptar',
      models: [User,Publicacion],
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule, PublicacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
