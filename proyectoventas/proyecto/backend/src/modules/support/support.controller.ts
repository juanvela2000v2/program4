import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { Role } from '../../common/enums';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { SupportService } from './support.service';

class CreateReportDto {
  @IsOptional()
  @IsString()
  listingId?: string;

  @IsOptional()
  @IsString()
  listingTitle?: string;

  @IsString()
  text: string;
}

@Controller('support')
export class SupportController {
  constructor(private readonly support: SupportService) {}

  @Post('reports')
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateReportDto) {
    return this.support.create({ ...dto, reporterId: user.id });
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: { roles?: string[] }) {
    const canRead = user.roles?.some((role) => [Role.Admin, Role.Support].includes(role as Role));
    if (!canRead) throw new ForbiddenException('Solo soporte o admin');
    return this.support.findAll();
  }

  @Patch('reports/:id/close')
  @UseGuards(JwtAuthGuard)
  close(@CurrentUser() user: { roles?: string[] }, @Param('id') id: string) {
    const canClose = user.roles?.some((role) => [Role.Admin, Role.Support].includes(role as Role));
    if (!canClose) throw new ForbiddenException('Solo soporte o admin');
    return this.support.close(id);
  }
}
