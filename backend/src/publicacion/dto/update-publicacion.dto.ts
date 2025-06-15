import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';
import { EstadoPublicacion } from '../publicacion.model';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePublicacionDto {
  @ApiProperty({ example: 'Se busca hogar para peludito de 4 patas' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Perro perdido en zona norte' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: 'Zona sur, Banfield' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @ApiProperty({ example: 'contacto@dominio.com' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contacto: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publicado?: Date;

  @IsOptional()
  @IsEnum(EstadoPublicacion)
  estado?: EstadoPublicacion;
}
