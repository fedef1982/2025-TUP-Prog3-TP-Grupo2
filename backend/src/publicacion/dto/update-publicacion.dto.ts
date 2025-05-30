import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { EstadoPublicacion } from '../publicacion.model';

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

  @IsEnum(EstadoPublicacion)
  @IsOptional()
  estado?: EstadoPublicacion;
}
