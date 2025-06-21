import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/usuario/usuario.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(pass, user.contrasenia))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, pass);

    const payload = { sub: user.id, username: user.email, rol_id: user.rol_id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
