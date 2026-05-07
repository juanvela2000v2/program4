import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  // Crear carpeta de fotos si no existe
  if (!existsSync('./uploads')) mkdirSync('./uploads');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Quitamos forbidNonWhitelisted porque usamos "any" en los nuevos endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Servidor corriendo en: http://localhost:3000/api');
}
bootstrap();