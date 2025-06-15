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
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVisitaDto {
  @ApiProperty({ example: Estado_visita.Pendiente })
  @IsOptional()
  @IsEnum(EstadoVisita)
  estado?: EstadoVisita;

  @ApiProperty({ example: 'Paola' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @ApiProperty({ example: 'Perez' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apellido?: string;

  @ApiProperty({ example: '+54 11 12345678' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'Calle falsa 123' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ example: 'contacto@dominio.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '2025-10-04' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  disponibilidad_fecha: Date;

  @ApiProperty({ example: Disponibilidad_horaria.Tarde })
  @IsOptional()
  @IsEnum(DisponibilidadHoraria)
  disponibilidad_horario?: DisponibilidadHoraria;

  @ApiProperty({ example: 'Nueva descripcion de visita' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
