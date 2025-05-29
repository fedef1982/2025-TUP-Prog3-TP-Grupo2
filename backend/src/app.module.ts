import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'adoptar',
      models: [User, Mascota, Especie, Condicion, Publicacion, Visita],
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
    MascotaModule,
    PublicacionModule,
    VisitaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
