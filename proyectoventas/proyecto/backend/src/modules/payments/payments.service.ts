import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as QRCode from 'qrcode';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../../common/enums';
import { CreatePaymentDto } from './dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    private readonly config: ConfigService,
  ) {}

  async create(buyerId: string, dto: CreatePaymentDto) {
    const commissionPercent = Number(this.config.get('PLATFORM_COMMISSION_PERCENT', 3));
    const platformFee = Number(((dto.amount * commissionPercent) / 100).toFixed(2));
    const payload = [
      '000201',
      '010212',
      `2600BUSCAYA-BOLIVIA`,
      '52040000',
      '5303068',
      `5405${Number(dto.amount).toFixed(2)}`,
      `6207${dto.listingId.slice(0, 7)}`,
      `6304${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    ].join('');
    const qrDataUrl = await QRCode.toDataURL(payload);

    return this.payments.save(
      this.payments.create({
        ...dto,
        buyerId,
        commissionPercent,
        platformFee,
        qrDataUrl,
        qrPayload: payload,
      }),
    );
  }

  async simulatePaid(id: string, webhookUrl?: string) {
    const payment = await this.payments.findOne({ where: { id } });
    if (!payment) return { ok: false };
    payment.status = PaymentStatus.Paid;
    const saved = await this.payments.save(payment);
    const webhookPayload = {
      id_transaccion: saved.id,
      estado: 'COMPLETADO',
      listingId: saved.listingId,
      monto: Number(saved.amount),
      comision: Number(saved.platformFee),
      metodo: saved.method,
      fecha: new Date().toISOString(),
    };

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
      } catch (error) {
        return { ...saved, webhookSent: false, webhookError: error instanceof Error ? error.message : 'Webhook fallido' };
      }
    }

    return { ...saved, webhookSent: Boolean(webhookUrl), webhookPayload };
  }

  async adminSummary() {
    const paid = await this.payments.find({ where: { status: PaymentStatus.Paid }, order: { createdAt: 'DESC' } });
    const totalSales = paid.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const totalProfit = paid.reduce((sum, payment) => sum + Number(payment.platformFee), 0);
    return {
      count: paid.length,
      totalSales: Number(totalSales.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
      payments: paid,
    };
  }
}
