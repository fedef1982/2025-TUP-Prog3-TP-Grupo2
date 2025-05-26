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
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  raza?: string;

  @IsEnum(Sexo)
  @IsOptional()
  sexo: Sexo;

  @IsInt()
  @Min(0)
  @IsOptional()
  edad?: number;

  @IsBoolean()
  @IsOptional()
  vacunado: boolean;

  @IsEnum(Tamanio)
  @IsOptional()
  tamanio: Tamanio;

  @IsArray()
  @ArrayMaxSize(4)
  @IsString({ each: true })
  @IsOptional()
  fotos_url: string[];

  @IsInt()
  @IsOptional()
  especie_id: number;

  @IsInt()
  @IsOptional()
  condicion_id: number;
}
