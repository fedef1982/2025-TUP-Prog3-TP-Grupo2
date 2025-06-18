import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './usuario/usuario.model';
import { UserModule } from './usuario/usuario.module';
import { Mascota } from './mascota/mascota.model';
import { MascotaModule } from './mascota/mascota.module';
import { EspecieModule } from './mascota/especie/especie.module';
import { CondicionModule } from './mascota/condicion/condicion.module';
import { Publicacion } from './publicacion/publicacion.model';
import { PublicacionModule } from './publicacion/publicacion.module';
import { Especie } from './mascota/especie/especie.model';
import { Condicion } from './mascota/condicion/condicion.model';
import { Visita } from './visita/visita.model';
import { VisitaModule } from './visita/visita.module';
import { AuthModule } from './auth/auth.module';
import { AccesoModule } from './acceso/acceso.module';
import { Rol } from './usuario/rol.model';

@Module({
  imports: [
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
        models: [User, Rol, Mascota, Especie, Condicion, Publicacion, Visita],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    UserModule,
    MascotaModule,
    EspecieModule,
    CondicionModule,
    PublicacionModule,
    VisitaModule,
    AuthModule,
    AccesoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
