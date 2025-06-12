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
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVisitaDto {
  @ApiProperty({ example: Estado_visita.Pendiente })
  @IsOptional()
  @IsEnum(Estado_visita)
  estado: string;

  @ApiProperty({ example: 'Paola' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Perez' })
  @IsOptional()
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
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2025-10-04' })
  @IsOptional()
  @IsDate()
  disponibilidad_fecha: Date;

  @ApiProperty({ example: Disponibilidad_horaria.Tarde })
  @IsOptional()
  @IsEnum(Disponibilidad_horaria)
  disponibilidad_horario: string;

  @ApiProperty({ example: 'Nueva descripcion de visita' })
  @IsOptional()
  @IsString()
  descripcion: string;
}
