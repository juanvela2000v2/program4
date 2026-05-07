import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('login')
  login(@Body() body: any) {
    return this.autenticacionService.login(body.email, body.password);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.autenticacionService.register(body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() request: any) {
    return this.autenticacionService.me(request.user.sub);
  }

  @Post('logout')
  logout() {
    return { success: true };
  }
}
