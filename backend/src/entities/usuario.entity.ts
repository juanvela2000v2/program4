import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Alerta } from './alerta.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column()
  nombre!: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'CIUDADANO'],
    default: 'CIUDADANO'
  })
  rol!: string;

  @Column({ nullable: true })
  telefono?: string; // Con "?" porque puede ser null

  @OneToMany(() => Alerta, (alerta) => alerta.usuario)
  alertas?: Alerta[];
}