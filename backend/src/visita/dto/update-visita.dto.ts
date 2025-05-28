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
  @IsEnum(Estado_visita)
  estado: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsEmail()
  email: string;

  @IsDate()
  disponibilidad_fecha: Date;

  @IsEnum(Disponibilidad_horaria)
  disponibilidad_horaria: string;

  @IsString()
  descripcion: string;
}
