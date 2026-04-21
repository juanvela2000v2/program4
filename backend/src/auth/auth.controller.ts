import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService)
    {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() datos){
        return this.authService.signIn(datos.login,datos.pass)
    }
}

