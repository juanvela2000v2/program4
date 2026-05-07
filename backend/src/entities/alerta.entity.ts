import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Ubicacion } from './ubicacion.entity';
import { Usuario } from './usuario.entity';

@Entity('alertas')
export class Alerta {
  @PrimaryGeneratedColumn() id!: number;
  @Column() tipoProblema!: string;

  @Column({ type: 'enum', enum: ['URGENTE', 'MODERADO', 'RESUELTO'], default: 'MODERADO' })
  estado: string = 'MODERADO';

  @Column({ type: 'text', nullable: true }) descripcion?: string;
  @Column({ nullable: true }) foto?: string;           // ruta del archivo subido

  @Column('decimal', { precision: 10, scale: 8, nullable: true }) latitud?: number;
  @Column('decimal', { precision: 10, scale: 8, nullable: true }) longitud?: number;

  @Column({ default: 1 }) reporteCount: number = 1;   // cuántos ciudadanos reportaron esto
  @Column({ default: 'CIUDADANO' }) fuente: string = 'CIUDADANO'; // 'CIUDADANO' | 'SENSOR'
  @Column({ nullable: true }) ipReportador?: string;

  @CreateDateColumn() fechaReporte!: Date;

  @ManyToOne(() => Ubicacion, (u) => u.alertas, { nullable: true })
  ubicacion?: Ubicacion;

  @ManyToOne(() => Usuario, (u) => u.alertas, { nullable: true })
  usuario?: Usuario;
}