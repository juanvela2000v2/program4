import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user/user';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ){}
    getUserByLogin(login:string):Promise<UserEntity|null>{
        return this.userRepository.findOne({
            where:{login:login}}
        );
    }
}
