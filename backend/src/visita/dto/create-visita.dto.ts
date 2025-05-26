/* eslint-disable prettier/prettier */
import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsOptional,
    IsNumber,
    IsEmail,
    IsDate,
    isEnum
  } from 'class-validator';


  export class CreateVisitaDto { 
      // @IsEnum(/*pasar enum*/)
      // estado: string;
    
       @IsString()
       @IsNotEmpty()
       nombre: string;
     
       @IsString()
       @IsNotEmpty()
       apellido: string;
     
       @IsOptional()
       @IsString()
       telefono?: string;
     
       @IsOptional()
       @IsString()
       direccion?: string;

        @IsEmail()
        email: string;

        @IsDate()
        disponibilidad_fecha: Date;

       // @IsEnum(/*pasar enum*/)
       // disponibilidad_horaria: string;

        @IsString()
        descripcion: string;
      }