import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { EstadoVisita } from './create-visita.dto';
import { DisponibilidadHoraria } from './create-visita.dto';

export class UpdateVisitaDto {
  @IsOptional()
  @IsEnum(EstadoVisita)
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
  disponibilidad_fecha: Date;

  @IsOptional()
  @IsEnum(DisponibilidadHoraria)
  disponibilidad_horario: string;

  @IsOptional()
  @IsString()
  descripcion: string;
}
