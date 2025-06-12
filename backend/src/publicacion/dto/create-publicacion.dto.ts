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
  @ApiProperty({ example: 'Se busca hogar para peludito de 4 patas' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Perro perdido en zona norte' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: 'Zona norte, Munro' })
  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @ApiProperty({ example: '+54 11 12345678' })
  @IsString()
  @IsNotEmpty()
  contacto: string;

  @ApiProperty({ example: EstadoPublicacion.Abierta })
  @IsEnum(EstadoPublicacion)
  @IsOptional()
  estado?: EstadoPublicacion;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  mascota_id: number;
}
