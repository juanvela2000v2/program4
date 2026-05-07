import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Contenedor {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column('float')
  lat!: number;

  @Column('float')
  lng!: number;

  @Column({ default: 0 })
  nivel!: number; // 0-100

  @Column({ default: 'VACIO' })
  estado!: string; // VACIO, MEDIO, LLENO

  @Column({ nullable: true })
  sensor_id!: string;
}