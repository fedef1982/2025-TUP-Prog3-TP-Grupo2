// definitions/publicaciones.ts

import { Pet } from "./definitionsPets";
import { User } from "./definitions";

export enum PublicationStatus {
  Abierta = 'Abierta',
  Cerrada = 'Cerrada',
}

export interface Publication {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  contacto: string;
  publicado: Date | null;
  estado: PublicationStatus;
  mascota_id: number;
  mascota: Pet;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export interface CreatePublicationDto {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  contacto: string;
  mascota_id: number;
}

export interface UpdatePublicationDto {
  titulo?: string;
  descripcion?: string;
  ubicacion?: string;
  contacto?: string;
  publicado?: Date;
  estado?: PublicationStatus;
}

export interface PublicationForm {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  contacto: string;
  mascota_id: number;
}

export interface EditPublicationFormProps {
  publication: Publication;
  userId: number;
  pets: Pet[];
}

export interface CreatePublicationState {
  message?: string;
  errors?: {
    titulo?: string[];
    descripcion?: string[];
    ubicacion?: string[];
    contacto?: string[];
    mascota_id?: string[];
  };
  success?: boolean;
}

export interface UpdatePublicationState {
  message?: string;
  errors?: {
    titulo?: string[];
    descripcion?: string[];
    ubicacion?: string[];
    contacto?: string[];
    estado?: string[];
  };
  success?: boolean;
}

export interface FilteredPublicationsParams {
  query?: string;
  page?: number;
  limit?: number;
  estado?: PublicationStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  published?: boolean;
  usuario_id?: number;
}

export interface PublicationsTable {
  id: string;
  titulo: string;
  descripcion: string;
  mascota: string;
  estado: PublicationStatus;
  publicado: string | null;
  createdAt: string;
}

export interface PublicationWithPet extends Publication {
  mascota: Pet & {
    especie?: {
      id: number;
      nombre: string;
    };
    condicion?: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    usuario?: User;
  };
}

export interface FilteredPublication {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  contacto: string;
  publicado: Date | null;
  estado: PublicationStatus;
  mascota_id: number;
  mascota?: Pet & {
    especie?: {
      id: number;
      nombre: string;
    };
    condicion?: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    usuario?: User;
  };
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PublicationsResponse {
  publicaciones: Publication[];
  total: number;
  totalPages: number;
}

export interface FullPublicationResponse extends Publication {
  mascota: Pet & {
    especie: {
      id: number;
      nombre: string;
    };
    condicion: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    usuario: User;
  };
}
