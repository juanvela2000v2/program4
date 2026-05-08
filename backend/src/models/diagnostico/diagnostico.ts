// backend/src/models/diagnostico/diagnostico.ts
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "../user/user"

@Entity('diagnostico')
export class DiagnosticoEntity {
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

    // --- Nuevos campos ---
    @Column({ type: 'text' })
    motivoConsulta: string = ''

    @Column({ type: 'text' })
    sintomas: string = ''

    @Column({ type: 'text' })
    evaluacionClinica: string = ''

    @Column({ type: 'text' })
    diagnostico: string = ''

    @Column({ nullable: true })
    cie10: string = ''

    @Column({ type: 'text', nullable: true })
    observaciones: string = ''

    @Column({ type: 'text', nullable: true })
    descripcion: string = ''   

    @CreateDateColumn()
    createdAt?: Date
}