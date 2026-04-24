import { Module } from '@nestjs/common';
import { JardinController } from './jardin.controller';
import { JardinService } from './jardin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JardinEntity } from 'src/models/jardin/jardin';
import { UUIDExistsRule } from 'src/shared/UUIDExistsRule';

@Module({
  imports:[TypeOrmModule.forFeature([JardinEntity])],
  controllers: [JardinController],
  providers: [JardinService,UUIDExistsRule]
})
export class JardinModule {}
