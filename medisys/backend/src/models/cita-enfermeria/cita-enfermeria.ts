import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "../user/user"
import { SalaEntity } from "../sala/sala"

@Entity('cita_enfermeria')
export class CitaEnfermeriaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = ''

    @Column()
    userId: number = 0

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ type: 'text', nullable: true })
    motivo: string = ''

    @Column({ nullable: true })
    imagen: string = ''

    @Column({ default: 'pendiente' })
    estado: string = 'pendiente'

    @Column({ nullable: true })
    tokenPago: string = ''

    @Column({ default: false })
    pagado: boolean = false

    @Column({ nullable: true, default: null })   // ← permite null
    salaId: number | null = null

    @ManyToOne(() => SalaEntity, { nullable: true })
    @JoinColumn({ name: 'salaId' })
    sala: SalaEntity

    @Column({ nullable: true, default: null })   // ← permite null
    enfermeraId: number | null = null

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'enfermeraId' })
    enfermera: UserEntity

    @CreateDateColumn()
    createdAt?: Date
}