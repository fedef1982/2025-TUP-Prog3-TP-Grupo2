import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/usuario/usuario.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'contrasenia' });
  }

  async validate(email: string, contrasenia: string): Promise<User> {
    const user = await this.authService.validateUser(email, contrasenia);
    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }
    return user;
  }
}
