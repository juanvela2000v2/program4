import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ListingStatus, ListingType } from '../../common/enums';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: '' })
  contactName: string;

  @Column({ default: '' })
  contactPhone: string;

  @Column({ type: 'enum', enum: ListingType })
  type: ListingType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ default: 'BOB' })
  currency: string;

  @Column({ default: 'Bolivia' })
  location: string;

  @Column({ type: 'longtext', nullable: true })
  imageUrl?: string;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.PendingReview })
  status: ListingStatus;

  @Column()
  ownerId: string;

  @Column({ type: 'json', nullable: true })
  moderation?: { approved: boolean; reasons: string[]; score: number };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
