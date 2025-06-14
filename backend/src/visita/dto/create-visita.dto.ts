import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
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
  disponibilidad_fecha: Date;

  @IsEnum(DisponibilidadHoraria)
  disponibilidad_horario: string;

  @IsString()
  @IsOptional()
  descripcion: string;
}
