import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "../user/user"
import { EspecialidadEntity } from "../especialidad/especialidad"
import { SalaEntity } from "../sala/sala"

export enum EstadoCita {
    PENDIENTE = 'pendiente',
    PAGADA = 'pagada',
    EN_ESPERA = 'en_espera',
    ATENDIDA = 'atendida'
}

@Entity('cita_medica')
export class CitaMedicaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = ''

    @Column()
    userId: number = 0

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column()
    especialidadId: number = 0

    @ManyToOne(() => EspecialidadEntity)
    @JoinColumn({ name: 'especialidadId' })
    especialidad: EspecialidadEntity

    @Column({ type: 'text', nullable: true })
    motivo: string = ''

    @Column({ type: 'varchar', default: EstadoCita.PENDIENTE })
    estado: string = EstadoCita.PENDIENTE

    @Column({ nullable: true })
    tokenPago: string = ''

    @Column({ default: false })
    pagado: boolean = false

    @Column({ nullable: true, default: null })   // ← acepta null
    salaId: number | null = null

    @ManyToOne(() => SalaEntity, { nullable: true })
    @JoinColumn({ name: 'salaId' })
    sala: SalaEntity

    @Column({ nullable: true, default: null })   // ← acepta null
    medicoId: number | null = null

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'medicoId' })
    medico: UserEntity

    @CreateDateColumn()
    createdAt?: Date
}