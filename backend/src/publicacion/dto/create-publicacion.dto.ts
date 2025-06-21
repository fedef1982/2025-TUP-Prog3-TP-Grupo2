import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  mascota_id: number;
}
