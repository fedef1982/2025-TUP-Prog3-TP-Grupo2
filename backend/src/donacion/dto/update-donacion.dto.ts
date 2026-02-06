import { IsOptional, IsString, Length, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDonacionDto {
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
  @IsOptional()
  cuit: string;

  @ApiProperty({ example: 'Banco Galicia' })
  @IsString()
  @IsOptional()
  entidad_financiera: string;

  @ApiProperty({ example: 'Adoptar123' })
  @IsString()
  @Length(6, 20)
  tipo_cuenta: string;

  @ApiProperty({ example: '+54 11 12345678' })
  @IsString()
  @IsOptional()
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
