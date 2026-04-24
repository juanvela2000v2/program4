import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDB } from './config/configDataBase';
import { JwtModule } from '@nestjs/jwt';
import { JardinModule } from './jardin/jardin.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot(configDB),
    AuthModule, 
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    JardinModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

//nest start --watch --env-file .env