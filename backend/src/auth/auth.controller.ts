import { Body, Controller, Req, Request, Res, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import express from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService)
    {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body() datos:LoginDto,
        @Res({ passthrough: true }) res: express.Response
    ){
        const x=  await this.authService.signIn(datos.login,datos.pass)
        res.cookie('token', x.access_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false // true en producción HTTPS
            });
        return {message:'ok'}
    }
    @Get('check')
    check(@Req() req: express.Request) {
        return !!req.cookies.token;
    }

    @UseGuards(AuthGuard)
    @Get('verifica')
    verificar(@Request() req ){
        return req.user
    }
}

