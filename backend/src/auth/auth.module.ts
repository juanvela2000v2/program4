import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './roles.guard'
import { AseguradoEntity } from 'src/models/asegurado/asegurado';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
@Module({
    imports: [TypeOrmModule.forFeature([AseguradoEntity]),UsersModule],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard,RolesGuard],
    exports: [AuthGuard,RolesGuard] 
})
export class AuthModule {}