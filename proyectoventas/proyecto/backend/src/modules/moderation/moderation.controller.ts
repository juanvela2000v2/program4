import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Role } from '../../common/enums';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ModerationService } from './moderation.service';

class ModerationDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  @Post('check')
  check(@Body() dto: ModerationDto) {
    return this.moderation.checkListing(dto.title, dto.description);
  }

  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  alerts(@CurrentUser() user: { roles?: string[] }) {
    if (!user.roles?.includes(Role.Admin)) throw new ForbiddenException('Solo admin');
    return this.moderation.findAlerts();
  }

  @Patch('alerts/:id/resolve')
  @UseGuards(JwtAuthGuard)
  resolve(@CurrentUser() user: { roles?: string[] }, @Param('id') id: string) {
    if (!user.roles?.includes(Role.Admin)) throw new ForbiddenException('Solo admin');
    return this.moderation.resolveAlert(id);
  }
}
