import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationModule } from '../moderation/moderation.module';
import { UsersModule } from '../users/users.module';
import { Listing } from './listing.entity';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listing]), ModerationModule, UsersModule],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
