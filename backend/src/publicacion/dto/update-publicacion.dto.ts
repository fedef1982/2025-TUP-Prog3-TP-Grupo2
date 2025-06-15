import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';
import { EstadoPublicacion } from '../publicacion.model';
import { Type } from 'class-transformer';

export class UpdatePublicacionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ubicacion: string;

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
