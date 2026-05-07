import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ListingsModule } from './listings/listings.module';
import { ModerationModule } from './moderation/moderation.module';
import { PaymentsModule } from './payments/payments.module';
import { SupportModule } from './support/support.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('MYSQL_HOST', 'localhost'),
        port: config.get('MYSQL_PORT', 3307),
        username: config.get('MYSQL_USER', 'user'),
        password: config.get('MYSQL_PASSWORD', '1234'),
        database: config.get('MYSQL_DATABASE', 'venta'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ListingsModule,
    PaymentsModule,
    ChatModule,
    ModerationModule,
    SupportModule,
  ],
})
export class AppModule {}
