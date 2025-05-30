import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';
import { Estado_visita } from './create-visita.dto';
import { Disponibilidad_horaria } from './create-visita.dto';

export class UpdateVisitaDto {
  @IsOptional()
  @IsEnum(Estado_visita)
  estado: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsDate()
  disponibilidad_fecha: Date;

  @IsOptional()
  @IsEnum(Disponibilidad_horaria)
  disponibilidad_horario: string;

  @IsOptional()
  @IsString()
  descripcion: string;
}
