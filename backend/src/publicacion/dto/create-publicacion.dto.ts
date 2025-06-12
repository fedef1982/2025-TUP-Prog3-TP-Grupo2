import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { EstadoPublicacion } from '../publicacion.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionDto {
  @ApiProperty({ example: 'Perro perdido en zona norte' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @IsString()
  @IsNotEmpty()
  contacto: string;

  @IsEnum(EstadoPublicacion)
  @IsOptional()
  estado?: EstadoPublicacion;

  @IsNumber()
  @IsNotEmpty()
  mascota_id: number;
}
