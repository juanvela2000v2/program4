import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ContenedoresModule } from './contenedores/contenedores.module';
import { Contenedor } from './contenedores/contenedor.entity';
import { ReportesModule } from './reportes/reportes.module';
import { Reporte } from './reportes/reporte.entity';
import { ReportesController } from './reportes/reportes.controller';
import { RutasModule } from './rutas/rutas.module';
import { Ruta } from './rutas/ruta.entity';
@Module({
  imports: [UsersModule,
    AuthModule,
  TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'residuos',
  entities: [User,Contenedor,Reporte,Ruta],
 
  synchronize: true,
}),
  

  ContenedoresModule,
  

  ReportesModule,
  

  RutasModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
