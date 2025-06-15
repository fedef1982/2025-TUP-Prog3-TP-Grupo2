import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';

export enum EstadoVisita {
  Pendiente = 'Pendiente',
  Aprobado = 'Aprobado',
  Rechazado = 'Rechazado',
}

export enum DisponibilidadHoraria {
  Maniana = 'Maniana',
  Tarde = 'Tarde',
  Noche = 'Noche',
}

export class CreateVisitaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  disponibilidad_fecha: Date;

  @IsEnum(DisponibilidadHoraria)
  disponibilidad_horario: DisponibilidadHoraria;

  @IsString()
  @IsOptional()
  descripcion: string;
}
