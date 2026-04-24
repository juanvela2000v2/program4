import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { IsAlphanumeric, IsEnum, IsInt, IsNotEmpty, IsPositive, IsUUID } from "class-validator";
import { JardinEntity, TipoPlantas } from "src/models/jardin/jardin";
import { UUIDExists } from "src/shared/UUIDExists";
import { EntityManager } from "typeorm";
@Injectable()
export class CreateJardinDto{
    
    @IsUUID()
    @IsNotEmpty()
    @UUIDExists(JardinEntity, { message: 'El jardin ya existente con el id' })
    id:string='';

    @IsAlphanumeric()
    @IsNotEmpty()
    nombre:string = '';

    @IsNotEmpty()
    @IsEnum(TipoPlantas)
    tipo:TipoPlantas = TipoPlantas.CESPED

    @IsInt()
    @IsPositive()
    largo:number=0;

    @IsInt()
    @IsPositive()
    ancho:number=0;
}