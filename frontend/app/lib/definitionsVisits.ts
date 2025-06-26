import { Publication } from "./definitionsPublications";
import { User } from "./definitions";

export enum VisitaEstado {
  Pendiente = 'Pendiente',
  Aprobado = 'Aprobado',
  Rechazado = 'Rechazado',
}

export enum DisponibilidadHoraria {
  Maniana = 'Maniana',
  Tarde = 'Tarde',
  Noche = 'Noche',
}

export interface Visita {
  id: number;
  estado: VisitaEstado;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  disponibilidad_fecha: Date;
  disponibilidad_horario: DisponibilidadHoraria;
  descripcion?: string;
  tracking: string;
  publicacion_id: number;
  publicacion: Publication;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export interface CreateVisitaDto {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  disponibilidad_fecha: Date;
  disponibilidad_horario: DisponibilidadHoraria;
  descripcion?: string;
}

export interface UpdateVisitaDto {
  estado?: VisitaEstado;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  disponibilidad_fecha?: Date;
  disponibilidad_horario?: DisponibilidadHoraria;
  descripcion?: string;
}

export interface VisitaForm {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  disponibilidad_fecha: Date;
  disponibilidad_horario: DisponibilidadHoraria;
  descripcion?: string;
  publicacion_id: number;
}

export interface EditVisitaFormProps {
  visita: Visita;
  userId: number;
  publicaciones: Publication[];
}

export interface CreateVisitaState {
  message?: string;
  errors?: {
    nombre?: string[];
    apellido?: string[];
    telefono?: string[];
    email?: string[];
    disponibilidad_fecha?: string[];
    disponibilidad_horario?: string[];
    descripcion?: string[];
    publicacion_id?: string[];
  };
  success?: boolean;
  trackingId?: string;
}

export interface UpdateVisitaState {
  message?: string;
  errors?: {
    estado?: string[];
    nombre?: string[];
    apellido?: string[];
    telefono?: string[];
    email?: string[];
    disponibilidad_fecha?: string[];
    disponibilidad_horario?: string[];
    descripcion?: string[];
  };
  success?: boolean;
}

export interface FilteredVisitasParams {
  query?: string;
  page?: number;
  limit?: number;
  estado?: VisitaEstado;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  usuario_id?: number;
}

export interface VisitasTable {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: VisitaEstado;
  disponibilidad_fecha: string;
  disponibilidad_horario: DisponibilidadHoraria;
  tracking: string;
  publicacion: string;
  createdAt: string;
}

export interface VisitaWithPublication extends Visita {
  publicacion: Publication & {
    mascota?: {
      id: number;
      nombre: string;
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
  };
}

export interface FilteredVisita {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  estado: VisitaEstado;
  disponibilidad_fecha: Date;
  disponibilidad_horario: DisponibilidadHoraria;
  descripcion?: string;
  tracking: string;
  publicacion_id: number;
  publicacion?: Publication & {
    mascota?: {
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
  };
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface VisitasResponse {
  visitas: Visita[];
  total: number;
  totalPages: number;
}

export interface FullVisitaResponse extends Visita {
  publicacion: Publication & {
    mascota: {
      id: number;
      nombre: string;
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
  };
}

export interface TrackingVisita {
  estado: VisitaEstado;
  fecha: Date;
  horario: DisponibilidadHoraria;
}

export interface SearchTrackingState {
  message?: string;
  errors?: {
    tracking?: string[];
  };
  success?: boolean;
  tracking?: TrackingVisita;
}


