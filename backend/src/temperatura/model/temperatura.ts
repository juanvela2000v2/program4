import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Temperatura{
    @PrimaryGeneratedColumn('uuid')
    id:string = '';

    @Column('float')
    value:number = 0;

    @Column({type:'timestamp',
        default:()=>'CURRENT_TIMESTAMP'})
    createdAt:Date=new Date();
}