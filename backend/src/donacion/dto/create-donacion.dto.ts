import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDonacionDto {
  @ApiProperty({ example: 'Carlos Perez' })
  @IsString()
  @IsOptional()
  destinatario: string;

  @ApiProperty({ example: '012345678910110001234567' })
  @IsOptional()
  @Length(22, 22)
  cbu: string;

  @ApiProperty({ example: '30-12345678910-0' })
  @IsString()
  @Length(11, 11)
  @IsOptional()
  cuit: string;

  @ApiProperty({ example: 'Banco Galicia' })
  @IsString()
  @IsNotEmpty()
  entidad_financiera: string;

  @ApiProperty({ example: 'Cuenta Corriente' })
  @IsString()
  @IsOptional()
  tipo_cuenta: string;

  @ApiProperty({ example: 'mi.alias.example' })
  @IsString()
  @IsNotEmpty()
  alias: string;

  @ApiProperty({ example: 'https://link.billetera.com.ar/donaciones' })
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @IsOptional()
  link_pago: string;

  @ApiProperty({
    example:
      'Cada donación que recibimos se destina a alimentación, medicación y limpieza',
  })
  @IsString()
  @IsOptional()
  motivo_donacion: string;
}
