import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity('insumo')
export class InsumoEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  nombre: string = ''

  @Column({ type: 'int', default: 0 })
  cantidad: number = 0

  @Column({ type: 'text', nullable: true })
  descripcion: string = ''
}