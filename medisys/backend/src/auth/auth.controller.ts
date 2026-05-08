import { Body, Controller, Post, Res, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegistroDto } from './dto/registro.dto'
import express from 'express'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() datos: LoginDto, @Res({ passthrough: true }) res: express.Response) {
        const x = await this.authService.signIn(datos.login, datos.pass)
        res.cookie('token', x.access_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        })
        return { message: 'ok', rol: x.rol }
    }

    @Post('registro')
    registro(@Body() dto: RegistroDto) {
        return this.authService.registro(dto)
    }
}