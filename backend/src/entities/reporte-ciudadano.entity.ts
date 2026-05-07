import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Alerta } from './alerta.entity';

@Entity('reportes_ciudadanos')
export class ReporteCiudadano {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ nullable: true }) ip?: string;
  @Column({ nullable: true }) usuarioId?: number;
  @ManyToOne(() => Alerta, { nullable: false, onDelete: 'CASCADE' }) alerta!: Alerta;
  @CreateDateColumn() fecha!: Date;
}