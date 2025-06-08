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
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  raza?: string;

  @IsEnum(Sexo)
  @IsNotEmpty()
  sexo: Sexo;

  @IsInt()
  @Min(0)
  @IsOptional()
  edad?: number;

  @IsBoolean()
  @IsNotEmpty()
  vacunado: boolean;

  @IsEnum(Tamanio)
  @IsNotEmpty()
  tamanio: Tamanio;

  @IsArray()
  @ArrayMaxSize(4)
  @IsString({ each: true })
  fotos_url: string[];

  @IsInt()
  @IsNotEmpty()
  especie_id: number;

  @IsInt()
  @IsNotEmpty()
  condicion_id: number;
}
