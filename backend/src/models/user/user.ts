import {PrimaryGeneratedColumn , Column, Entity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id:number=1;

    @Column()
    nombre:string='';

    @Column()
    login:string = '';

    @Column()
    pass:string ='';

    @CreateDateColumn()
    createdAt?:Date

    @DeleteDateColumn()
    deletedAt?:Date

    @UpdateDateColumn()
    updatedAt?:Date

}
