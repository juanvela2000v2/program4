// src/reportes/reporte.entity.ts
import { Contenedor } from 'src/contenedores/contenedor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Reporte {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  descripcion!: string;

 

  @Column({ default: 'PENDIENTE' })
  estado!: string;

  @Column()
  usuarioId!: number;

  
  @ManyToOne(() => Contenedor)
contenedor!: Contenedor;
}