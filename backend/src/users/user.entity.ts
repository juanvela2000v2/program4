import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Rol {
  ADMIN = 'ADMIN',
  RECOLECTOR = 'RECOLECTOR',
  CIUDADANO = 'CIUDADANO',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: Rol,
    default: Rol.CIUDADANO,
  })
  rol!: Rol;
}