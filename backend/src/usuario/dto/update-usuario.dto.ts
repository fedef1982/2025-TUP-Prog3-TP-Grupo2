import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiProperty({ example: 'contacto@dominio.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Adriel' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @ApiProperty({ example: 'Reina' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apellido?: string;

  @ApiProperty({ example: 'ContraS3gura' })
  @IsOptional()
  @IsString()
  @Length(6, 20)
  contrasenia?: string;

  @ApiProperty({ example: '+54 11 12345678' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'Calle falsa 123' })
  @IsOptional()
  @IsString()
  direccion?: string;
}
