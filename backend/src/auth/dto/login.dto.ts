import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'contacto@dominio.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Adoptar123' })
  @IsString()
  @MinLength(6)
  contrasenia: string;
}
