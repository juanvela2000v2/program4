import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
=======
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService }    from './app.service';
import { SharedModule }  from './shared/shared.module';

import { Sensor }           from './entities/sensor.entity';
import { Alerta }           from './entities/alerta.entity';
import { Ubicacion }        from './entities/ubicacion.entity';
import { Usuario }          from './entities/usuario.entity';
import { ReporteCiudadano } from './entities/reporte-ciudadano.entity';

import { SensorModule }    from './sensor/sensor.module';
import { AlertaModule }    from './alerta/alerta.module';
import { UsuarioModule }   from './usuario/usuario.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { AuthModule }      from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    SharedModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api/(.*)'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'potosi_ambiental',
      entities: [Sensor, Ubicacion, Alerta, Usuario, ReporteCiudadano],
      synchronize: false,
      logging: false,
    }),
    SensorModule, AlertaModule, UsuarioModule, UbicacionModule, AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
>>>>>>> main
