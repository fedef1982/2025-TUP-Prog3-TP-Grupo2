import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ example: 'Alberto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Gomez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ example: '+54 11 12345678' })  
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({ example: 'contacto@dominio.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '2025-07-01' })  
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  disponibilidad_fecha: Date;

  @ApiProperty({ example: DisponibilidadHoraria.Noche })
  @IsEnum(DisponibilidadHoraria)
  disponibilidad_horario: DisponibilidadHoraria;

  @ApiProperty({ example: 'Descripcion de visita' })
  @IsString()
  @IsOptional()
  descripcion: string;
}
