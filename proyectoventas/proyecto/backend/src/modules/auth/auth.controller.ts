import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from './jwt.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.register(dto);
    this.setCookie(res, result.token);
    return { user: this.safeUser(result.user) };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.login(dto);
    this.setCookie(res, result.token);
    return { user: this.safeUser(result.user) };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(process.env.COOKIE_NAME ?? 'mp_session');
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: unknown) {
    return this.safeUser(user as any);
  }

  private setCookie(res: Response, token: string) {
    res.cookie(process.env.COOKIE_NAME ?? 'mp_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private safeUser(user: { id: string; email: string; name: string; roles: string[] }) {
    return { id: user.id, email: user.email, name: user.name, roles: user.roles };
  }
}
