import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity('sala')
export class SalaEntity {
    @PrimaryGeneratedColumn()
    id: number = 0

    @Column()
    nombre: string = ''
}