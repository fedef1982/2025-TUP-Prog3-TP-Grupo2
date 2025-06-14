import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  mascota_id: number;
}
