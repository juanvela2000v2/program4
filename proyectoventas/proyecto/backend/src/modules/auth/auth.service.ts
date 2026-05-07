import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const passwordHash = await bcrypt.hash(dto.password, 12);
      const user = await this.users.create({ email: dto.email, name: dto.name, passwordHash });
      return { user, token: await this.sign(user.id, user.email, user.roles) };
    } catch (err) {
      console.error('AuthService.register error:', err);
      throw err;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    return { user, token: await this.sign(user.id, user.email, user.roles) };
  }

  private sign(sub: string, email: string, roles: string[]) {
    return this.jwt.signAsync(
      { sub, email, roles },
      {
        secret: this.config.get('JWT_SECRET', 'dev-secret'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
      },
    );
  }
}
