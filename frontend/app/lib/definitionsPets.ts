// Definiciones para mascotas

import { User } from "./definitions";

export enum PetStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  ADOPTADO = 'ADOPTADO',
  EN_PROCESO = 'EN_PROCESO',
}

export enum Size {
  CHICO = 'Chico',
  MEDIANO = 'Mediano',
  GRANDE = 'Grande',
}

export enum Gender {
  MACHO = 'Macho',
  HEMBRA = 'Hembra',
}

export interface Pet {
  id: number;
  nombre: string;
  raza?: string;
  sexo: Gender;
  edad?: number;
  vacunado: boolean;
  tamanio: Size;
  fotos_url: string[];
  especie_id: number;
  condicion_id: number;
  usuario_id: number;
  descripcion?: string;
  status: PetStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface EditPetFormProps {
  pet: Pet;
  userId: number;
  species: Species[];
  conditions: Condition[];
}

export interface CreatePetState {
  message?: string;
  errors?: {
    nombre?: string[];
    especie_id?: string[];
    condicion_id?: string[];
    fotos_url?: string[];
  };
  success?: boolean;
}

export interface UpdatePetState {
  message?: string;
  errors?: {
    nombre?: string[];
    especie_id?: string[];
    condicion_id?: string[];
    fotos_url?: string[];
  };
  success?: boolean;
}

export interface FilteredPetsParams {
  query?: string;
  page?: number;
  limit?: number;
  especie_id?: number;
  condicion_id?: number;
  tamanio?: Size;
  sexo?: Gender;
  vacunado?: boolean;
  minAge?: number;
  maxAge?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: PetStatus;
}

export interface PetsTable {
  id: string;
  nombre: string;
  especie: string;
  condicion: string;
  tamanio: Size;
  sexo: Gender;
  edad?: number;
  vacunado: boolean;
  status: PetStatus;
  createdAt: string;
};

export interface PetForm {
  id?: string;
  nombre: string;
  raza?: string;
  sexo: Gender;
  edad?: number;
  vacunado: boolean;
  tamanio: Size;
  fotos_url: string[];
  especie_id: number;
  condicion_id: number;
  descripcion?: string;
  status: PetStatus;
};

export interface FilteredPet {
  id: number; 
  nombre: string;
  especie_id: number;
  condicion_id: number;
  especie?: Species; 
  condicion?: Condition;
  usuario?: User;
  tamanio: Size;
  sexo: Gender;
  edad?: number;
  vacunado: boolean;
  fotos_url: string[];
  status: PetStatus;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreatePetDto {
  nombre: string;
  raza?: string;
  sexo: Gender;
  edad?: number;
  vacunado: boolean;
  tamanio: Size;
  fotos_url: string[];
  especie_id: number;
  condicion_id: number;
  descripcion?: string;
}

export interface UpdatePetDto {
  nombre?: string;
  raza?: string;
  sexo?: Gender;
  edad?: number;
  vacunado?: boolean;
  tamanio?: Size;
  fotos_url?: string[];
  especie_id?: number;
  condicion_id?: number;
  descripcion?: string;
  status?: PetStatus;
}

export interface Species {
  id: number;
  nombre: string;
}

export interface Condition {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface SpeciesSelectProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  species?: Species[];
  className?: string;
  required?: boolean;
}

export interface ConditionSelectProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  conditions?: Condition[];
  className?: string;
  required?: boolean;
}

// Tipo para las props del formulario
export interface PetFormSelectsProps {
  speciesList: Species[];
  conditionsList: Condition[];
}