import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sensor } from './sensor.entity';
import { Alerta } from './alerta.entity';

@Entity('ubicaciones')
export class Ubicacion {
  @PrimaryGeneratedColumn() id!: number;
  @Column() nombre!: string;
  @Column('decimal', { precision: 10, scale: 8, default: 0 }) latitud: number = 0;
  @Column('decimal', { precision: 10, scale: 8, default: 0 }) longitud: number = 0;
  @Column({ type: 'text', nullable: true }) descripcion?: string;
  @Column({ default: 'MINERIA' }) tipoArea!: string;
  @Column('float', { default: 0 }) limiteAire: number = 0;
  @Column('float', { default: 0 }) limiteAgua: number = 0;

  // Campos de simulacion
  @Column({ default: false })
  esVirtual: boolean = false;

  @Column({ default: 5 })
  intervaloSegundos: number = 5;

  @Column('float', { default: 50 })
  valorMinSimulado: number = 50;

  @Column('float', { default: 800 })
  valorMaxSimulado: number = 800;

  @OneToMany(() => Sensor, (s) => s.ubicacion) sensores?: Sensor[];
  @OneToMany(() => Alerta, (a) => a.ubicacion) alertas?: Alerta[];
}