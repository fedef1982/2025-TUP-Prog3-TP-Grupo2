import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ example: Estado_visita.Aprobado })
  @IsEnum(Estado_visita)
  estado: string;

  @ApiProperty({ example: 'Alberto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Gomez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ example: '+54 11 12345678' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'Calle falsa 123' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ example: 'contacto@dominio.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2025-07-01' })
  @IsDate()
  disponibilidad_fecha: Date;
  
  @ApiProperty({ example: Disponibilidad_horaria.Noche })
  @IsEnum(Disponibilidad_horaria)
  disponibilidad_horario: string;

  @ApiProperty({ example: 'Descripcion de visita' })
  @IsString()
  descripcion: string;
}
