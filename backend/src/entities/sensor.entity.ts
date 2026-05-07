import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Ubicacion } from './ubicacion.entity';

@Entity('sensores')
export class Sensor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tipo!: string; // 'AIRE' o 'AGUA'

  @Column('float', { default: 0 })
  valor: number = 0;

  @Column({ nullable: true, default: 'N/A' })
  unidad?: string;

  @CreateDateColumn()
  fecha!: Date;

  @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.sensores, { nullable: true })
  ubicacion?: Ubicacion;
}