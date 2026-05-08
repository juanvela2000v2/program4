import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "../user/user"

export enum SeveridadAlergia {
    LEVE = 'leve',
    MODERADA = 'moderada',
    SEVERA = 'severa'
}

@Entity('alergia')
export class AlergiaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = ''

    @Column()
    pacienteId: number = 0

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'pacienteId' })
    paciente: UserEntity

    @Column()
    medicoId: number = 0

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'medicoId' })
    medico: UserEntity

    @Column()
    agente: string = ''

    @Column({ type: 'text' })
    tipoReaccion: string = ''

    @Column({ type: 'enum', enum: SeveridadAlergia, default: SeveridadAlergia.MODERADA })
    severidad: string = SeveridadAlergia.MODERADA

    @Column({ default: 'activa' })
    estatus: string = 'activa'

    @Column()
    fuente: string = ''

    @CreateDateColumn()
    createdAt?: Date
}