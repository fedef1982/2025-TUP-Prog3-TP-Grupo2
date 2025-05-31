import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';

export enum Estado_visita {
  Pendiente = 'Pendiente',
  Aprobado = 'Aprobado',
  Rechazado = 'Rechazado',
}

export enum Disponibilidad_horaria {
  Maniana = 'Maniana',
  Tarde = 'Tarde',
  Noche = 'Noche',
}

export class CreateVisitaDto {
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
  disponibilidad_horario: string;

  @IsString()
  descripcion: string;
}
