import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './usuario/usuario.model';
import { UserModule } from './usuario/usuario.module';
import { Mascota } from './mascota/mascota.model';
import { MascotaModule } from './mascota/mascota.module';
import { Publicacion } from './publicacion/publicacion.model';
import { PublicacionModule } from './publicacion/publicacion.module';
import { Especie } from './mascota/especie.model';
import { Condicion } from './mascota/condicion.model';
import { Visita } from './visita/visita.model';
import { VisitaModule } from './visita/visita.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'paola',
      database: 'adoptar',
      models: [User, Mascota, Especie, Condicion, Publicacion, Visita],
      autoLoadModels: true,
      synchronize: true,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [User, Mascota, Especie, Condicion, Publicacion, Visita],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    UserModule,
    MascotaModule,
    PublicacionModule,
    VisitaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
