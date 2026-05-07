import { Module } from '@nestjs/common';
import { ContenedoresController } from './contenedores.controller';
import { ContenedoresService } from './contenedores.service';
import { Contenedor } from './contenedor.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contenedor])],
  controllers: [ContenedoresController],
  providers: [ContenedoresService]
})
export class ContenedoresModule {}
