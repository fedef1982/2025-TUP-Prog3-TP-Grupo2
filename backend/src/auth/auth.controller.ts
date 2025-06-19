import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../usuario/usuario.model';
import { Public } from './decorators/public.decorator';
import { DocGetProfile, DocPostLogin } from './auth.doc';

interface AuthRequest extends Request {
  user: User;
}

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

  @DocGetProfile()
  @Get('profile')
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }
}
