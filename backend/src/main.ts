import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AdoptAR API')
    .setDescription(
      'Bienvenido, aqui podras encontrar la documentacion de la API de AdoptAR',
    )
    .setVersion('1.0')
    .addGlobalResponse({
      status: 200,
      description: 'Ok',
    })
    /*.addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    /*
    .addGlobalResponse({
      status: 401,
      description: 'Unauthorized',
    })
      */
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
