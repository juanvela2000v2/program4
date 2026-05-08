// backend/src/models/receta/receta.ts
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "../user/user"

@Entity('receta')
export class RecetaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = ''

    @Column()
    userId: number = 0

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column()
    medicoId: number = 0

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'medicoId' })
    medico: UserEntity

    @Column({ type: 'date' })
    fecha: string = ''

    @Column()
    medicamento: string = ''

    @Column()
    dosis: string = ''

    @Column()
    frecuencia: string = ''

    @Column()
    duracion: string = ''

    @Column({ type: 'text', nullable: true })
    instrucciones: string = ''

    @CreateDateColumn()
    createdAt?: Date
}