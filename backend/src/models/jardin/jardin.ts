import {PrimaryGeneratedColumn , Column, Entity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
export enum TipoPlantas  {
    ROSAS='Rosas',
    CLAVEL='Clavel',
    CESPED ='Cesped'
}
@Entity('jardin')
export class JardinEntity {
    @PrimaryGeneratedColumn("uuid")
    id:string='';

    @Column()
    nombre:string='';

    @Column({
        type:'enum',
        enum:TipoPlantas,
        default:TipoPlantas.CESPED
    })
    tipo:TipoPlantas = TipoPlantas.CESPED;

    @Column({type:'decimal'})
    largo:number=0;

    @Column({type:'decimal'})
    ancho:number=0;


    @CreateDateColumn()
    createdAt?:Date

    @DeleteDateColumn()
    deletedAt?:Date

    @UpdateDateColumn()
    updatedAt?:Date

}
