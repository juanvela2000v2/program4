import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ruta {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column('simple-json')
  puntos!: { lat: number; lng: number }[];
  

  @Column()
  recolectorId!: number;

}