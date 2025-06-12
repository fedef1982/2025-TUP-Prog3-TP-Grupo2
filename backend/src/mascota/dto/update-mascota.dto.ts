import {
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  Min,
  IsNotEmpty,
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

export class UpdateMascotaDto {
  @ApiProperty({ example: 'Balboa' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Siberiano' })
  @IsString()
  @IsOptional()
  raza?: string;

  @ApiProperty({ example: 'Hembra' })
  @IsEnum(Sexo)
  @IsOptional()
  sexo: Sexo;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  @IsOptional()
  edad?: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  vacunado: boolean;

  @ApiProperty({ example: Tamanio.Grande })
  @IsEnum(Tamanio)
  @IsOptional()
  tamanio: Tamanio;

    @ApiProperty({
    example: [
      'https://example.com/foto1.jpg',
      'https://example.com/foto2.jpg',
      'https://example.com/foto3.jpg',
      'https://example.com/foto4.jpg'
        ]
  })
  @IsArray()
  @ArrayMaxSize(4)
  @IsString({ each: true })
  @IsOptional()
  fotos_url: string[];

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional()
  especie_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional()
  condicion_id: number;
}
