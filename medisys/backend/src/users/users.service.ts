import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../models/user/user'
import { Repository, Not } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async getUserByLogin(login: string) {
    return this.userRepository.findOneBy({ login })
  }

  async findAll() {
    return this.userRepository.find()
  }

  async create(data: Partial<UserEntity>) {
    if (data.especialidadId === 0 || data.especialidadId === undefined) {
        data.especialidadId = null;
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
}

  async update(id: number, data: any) {
    await this.userRepository.update(id, data)
    return this.userRepository.findOneBy({ id })
  }

  async remove(id: number) {
    return this.userRepository.softDelete(id)
  }

  async findByRole(role: string) {
    return this.userRepository.find({
        where: { rol: role as any },
        relations: ['especialidad']   // ← esta línea es clave
    })
}
}