import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'contacto@dominio.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Pepito' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Perez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ example: 'Adoptar123' })
  @IsString()
  @Length(6, 20)
  contrasenia: string;

  @ApiProperty({ example: '+54 11 12345678' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'Calle falsa 123' })
  @IsOptional()
  @IsString()
  direccion?: string;
}
