import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '../../common/enums';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePaymentDto, SimulatePaymentDto } from './dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('qr')
  @UseGuards(JwtAuthGuard)
  createQr(@CurrentUser() user: { id: string }, @Body() dto: CreatePaymentDto) {
    return this.payments.create(user.id, dto);
  }

  @Patch(':id/simulate-paid')
  @UseGuards(JwtAuthGuard)
  simulatePaid(@Param('id') id: string, @Body() dto: SimulatePaymentDto) {
    return this.payments.simulatePaid(id, dto.webhookUrl);
  }

  @Get('admin/summary')
  @UseGuards(JwtAuthGuard)
  adminSummary(@CurrentUser() user: { roles?: string[] }) {
    if (!user.roles?.includes(Role.Admin)) throw new ForbiddenException('Solo admin');
    return this.payments.adminSummary();
  }
}
