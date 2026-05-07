import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentStatus } from '../../common/enums';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  listingId: string;

  @Column()
  buyerId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  platformFee: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  commissionPercent: number;

  @Column({ default: 'QR_BANCO' })
  method: string;

  @Column({ type: 'longtext' })
  qrDataUrl: string;

  @Column({ type: 'text', nullable: true })
  qrPayload?: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;
}
