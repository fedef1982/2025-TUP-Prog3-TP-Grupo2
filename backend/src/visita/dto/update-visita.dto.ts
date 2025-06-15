import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';
import { EstadoVisita } from './create-visita.dto';
import { DisponibilidadHoraria } from './create-visita.dto';
import { Type } from 'class-transformer';

export class UpdateVisitaDto {
  @IsOptional()
  @IsEnum(EstadoVisita)
  estado?: EstadoVisita;

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
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  disponibilidad_fecha: Date;

  @IsOptional()
  @IsEnum(DisponibilidadHoraria)
  disponibilidad_horario?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
