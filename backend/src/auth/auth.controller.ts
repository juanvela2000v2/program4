import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService)
    {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() datos:LoginDto){
        return this.authService.signIn(datos.login,datos.pass)
    }

    @UseGuards(AuthGuard)
    @Get('verifica')
    verificar(@Request() req ){
        return req.user
    }
}

