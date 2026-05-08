import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm"
import { ManyToOne, JoinColumn } from "typeorm"
import { EspecialidadEntity } from "../especialidad/especialidad"
export enum RolUsuario {
    ADMIN = 'admin',
    MEDICO = 'medico',
    ENFERMERA = 'enfermera',
    USUARIO = 'usuario'
}

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number = 0

    @Column()
    nombre: string = ''

    @Column()
    apellidoPaterno: string = ''

    @Column()
    apellidoMaterno: string = ''

    @Column()
    ci: string = ''

    @Column({ type: 'date' })
    fechaNacimiento: string = ''

    @Column()
    sexo: string = ''

    @Column()
    direccion: string = ''

    @Column()
    telefono: string = ''

    @Column({ nullable: true })
    correo: string = ''

    @Column({ nullable: true })
    codigoAsegurado: string = ''

    @Column({ default: false })
    esAsegurado: boolean = false

    @Column({ unique: true })
    login: string = ''

    @Column()
    pass: string = ''

    @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.USUARIO })
    rol: RolUsuario = RolUsuario.USUARIO

    @CreateDateColumn()
    createdAt?: Date

    @DeleteDateColumn()
    deletedAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date
    @Column({ nullable: true })
    especialidadId: number | null = null;

    @ManyToOne(() => EspecialidadEntity, { nullable: true })
    @JoinColumn({ name: 'especialidadId' })
    especialidad: EspecialidadEntity
}