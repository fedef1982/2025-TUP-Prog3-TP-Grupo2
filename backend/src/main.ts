import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Adoptar example')
    .setDescription('Aprende a usar la API de AdoptAR ')
    .setVersion('1.0')
    .addTag('tagDePrueba')
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    .addGlobalResponse({
      status: 401,
      description: 'Unauthorized',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000', // O el puerto donde corre tu Next.js
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
