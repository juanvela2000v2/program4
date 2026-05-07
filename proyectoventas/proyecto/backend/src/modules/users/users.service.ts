import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../../common/enums';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async onModuleInit() {
    await this.ensureSeedUser({
      email: process.env.ADMIN_EMAIL ?? 'admin@buscaya.bo',
      name: 'Administrador',
      password: process.env.ADMIN_PASSWORD ?? 'Admin123!',
      roles: [Role.Admin, Role.Support, Role.User, Role.Seller],
    });
    await this.ensureSeedUser({
      email: process.env.SUPPORT_EMAIL ?? 'soporte@buscaya.bo',
      name: 'Soporte',
      password: process.env.SUPPORT_PASSWORD ?? 'Soporte123!',
      roles: [Role.Support, Role.User],
    });
  }

  findByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.users.findOne({ where: { id } });
  }

  create(input: { email: string; name: string; passwordHash: string; roles?: Role[] }) {
    return this.users.save(this.users.create({ ...input, roles: input.roles ?? [Role.User, Role.Seller] }));
  }

  private async ensureSeedUser(input: { email: string; name: string; password: string; roles: Role[] }) {
    const existing = await this.findByEmail(input.email);
    if (existing) return existing;
    const passwordHash = await bcrypt.hash(input.password, 12);
    return this.create({ email: input.email, name: input.name, passwordHash, roles: input.roles });
  }
}
