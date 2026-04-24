import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JardinEntity } from 'src/models/jardin/jardin';
import { IsNull, Like, Repository } from 'typeorm';
import { CreateJardinDto } from './dto/createJardin.dto';

@Injectable()
export class JardinService {
    constructor(
            @InjectRepository(JardinEntity)
            private jardinRepository: Repository<JardinEntity>
         ){
    }
    public async  getAll(page=1,limit=10,search:string=''){
        const whereCondicion:any={
            deletedAt:IsNull()
        }
        if(search!='')
            whereCondicion.nombre = Like(`%${search}%`)

        const [data,total] = await this.jardinRepository.findAndCount({
            skip:(page-1)*limit,
            take:limit,
            order:{createdAt:'DESC'},
            where:whereCondicion
        });
        return {
            data,
            total,
            page,
            limit,
            lastPage:Math.ceil(total/limit)
        }
    }
    async remove(id:string){
        return this.jardinRepository.softDelete(id);
    }
    async restore(id:string){
        return this.jardinRepository.restore(id);
    }
    async findOne(id:string){
        return this.jardinRepository.findOneBy({id});
    }
    async create(dto:CreateJardinDto){
        const jardin = this.jardinRepository.create(dto);
        return this.jardinRepository.save(jardin);
    }
    async update(id:string,value){
        await this.jardinRepository.update(id,value);
        return this.findOne(id);
    }
}
