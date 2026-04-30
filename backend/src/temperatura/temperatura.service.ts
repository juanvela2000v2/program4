import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Temperatura } from './model/temperatura';
import { Repository } from 'typeorm';

@Injectable()
export class TemperaturaService {
    constructor(
        @InjectRepository(Temperatura)
        private temperaturaRepository:Repository<Temperatura>
    ){}
    public async  guardar(value:number){
        return this.temperaturaRepository.save({value});
    }
    public async  findAll(){
        return this.temperaturaRepository.find(
            {
                order:{createdAt:'DESC'}
            }
        )
    }
}
