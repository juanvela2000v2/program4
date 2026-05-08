import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "../user/user"
import { InsumoEntity } from "../insumo/insumo"

@Entity('dispensacion')
export class DispensacionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = ''

    @Column()
    pacienteId: number = 0

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'pacienteId' })
    paciente: UserEntity

    @Column()
    enfermeraId: number = 0

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'enfermeraId' })
    enfermera: UserEntity

    @Column()
    insumoId: number = 0

    @ManyToOne(() => InsumoEntity)
    @JoinColumn({ name: 'insumoId' })
    insumo: InsumoEntity

    @Column({ type: 'int' })
    cantidad: number = 0

    @Column({ type: 'date' })
    fecha: string = ''

    @CreateDateColumn()
    createdAt?: Date
}