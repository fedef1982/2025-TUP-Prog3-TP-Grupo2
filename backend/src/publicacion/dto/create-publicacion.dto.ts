import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { EstadoPublicacion } from '../publicacion.model';

export class CreatePublicacionDto {
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
