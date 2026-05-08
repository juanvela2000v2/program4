import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('asegurados')
export class AseguradoEntity {
    @PrimaryGeneratedColumn()
    id: number = 0

    @Column({ unique: true })
    codigo: string;

    @CreateDateColumn()
    created_at?: Date

    @UpdateDateColumn()
    updated_at?: Date
}