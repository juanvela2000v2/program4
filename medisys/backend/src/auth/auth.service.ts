import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { AseguradoEntity } from 'src/models/asegurado/asegurado'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(AseguradoEntity) private aseguradoRepo: Repository<AseguradoEntity>
    ) {}

    async signIn(login: string, password: string) {
        const user = await this.usersService.getUserByLogin(login)
        if (!user) throw new UnauthorizedException('Credenciales incorrectas')
        const comparePass = bcrypt.compareSync(password, user.pass)
        if (!comparePass) throw new UnauthorizedException('Credenciales incorrectas')
        const payload = {
            sub: user.id,
            nombre: user.nombre,
            login: user.login,
            rol: user.rol,
        }
        const token = this.jwtService.sign(payload)
        return { access_token: token, type: 'bearer', rol: user.rol }
    }

    async registro(dto: any) {
        const existe = await this.usersService.getUserByLogin(dto.login)
        if (existe) throw new BadRequestException('El usuario ya existe')

        // Verificar código de asegurado
        let esAsegurado = false
        if (dto.codigoAsegurado && dto.codigoAsegurado.trim() !== '') {
            const asegurado = await this.aseguradoRepo.findOneBy({ codigo: dto.codigoAsegurado.trim() })
            if (asegurado) {
                esAsegurado = true
            } else {
                // Si se proporcionó un código inválido, podemos rechazar o ignorar. 
                // Yo recomendaría ignorar y marcarlo como no asegurado.
                // throw new BadRequestException('Código de asegurado no válido')
                dto.codigoAsegurado = '' // limpiamos el código para no guardarlo
            }
        }

        const hash = bcrypt.hashSync(dto.pass, 10)
        return this.usersService.create({
            ...dto,
            pass: hash,
            rol: 'usuario',
            esAsegurado,
            codigoAsegurado: esAsegurado ? dto.codigoAsegurado : ''
        })
    }
}