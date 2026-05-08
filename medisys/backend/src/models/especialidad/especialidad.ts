import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity('especialidad')
export class EspecialidadEntity {
    @PrimaryGeneratedColumn()
    id: number = 0

    @Column()
    nombre: string = ''
}