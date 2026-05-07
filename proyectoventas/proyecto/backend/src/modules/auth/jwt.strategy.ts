import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

const cookieExtractor = (request: Request) => request?.cookies?.[process.env.COOKIE_NAME ?? 'mp_session'] ?? null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', 'dev-secret'),
    });
  }

  validate(payload: { sub: string; email: string; roles: string[] }) {
    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
