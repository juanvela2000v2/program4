import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  //useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
    origin:'http://localhost:4200',
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
