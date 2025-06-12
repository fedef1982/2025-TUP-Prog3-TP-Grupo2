import {
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Tamanio {
  Chico = 'Chico',
  Mediano = 'Mediano',
  Grande = 'Grande',
}

export enum Sexo {
  Macho = 'Macho',
  Hembra = 'Hembra',
}

export class CreateMascotaDto {
  @ApiProperty({ example: 'Rocky' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Labrador' })
  @IsString()
  @IsOptional()
  raza?: string;

  @ApiProperty({ example: 'Macho' })
  @IsEnum(Sexo)
  @IsNotEmpty()
  sexo: Sexo;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  edad?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  vacunado: boolean;

  @ApiProperty({ example: Tamanio.Mediano })
  @IsEnum(Tamanio)
  @IsNotEmpty()
  tamanio: Tamanio;

  @ApiProperty({
    example: [
      'https://example.com/foto1.jpg',
      'https://example.com/foto2.jpg',
      'https://example.com/foto3.jpg',
      'https://example.com/foto4.jpg',
    ],
  })
  @IsArray()
  @ArrayMaxSize(4)
  @IsString({ each: true })
  fotos_url: string[];

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  especie_id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  condicion_id: number;
}
