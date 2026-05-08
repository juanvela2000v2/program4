import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.use(cookieParser())
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }))
    app.enableCors({
    origin: ['http://localhost:4200', 'http://192.168.1.14:4200'],   // agrega tu IP aquí
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
})

    // Servir archivos estáticos desde la carpeta uploads
    app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' })

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()