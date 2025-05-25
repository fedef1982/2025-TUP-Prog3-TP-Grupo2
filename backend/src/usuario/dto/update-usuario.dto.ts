import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apellido?: string;

  @IsOptional()
  @IsString()
  @Length(6, 20)
  contrasenia?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
