import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { DocPostLogin } from './auth.doc';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @DocPostLogin()
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.contrasenia);
  }
}
