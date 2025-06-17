export enum Role {
  ADMIN = 'ADMIN',
  PUBLICADOR = 'PUBLICADOR',
}

export enum UserStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  contrasenia: string;
  telefono?: string;
  direccion?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface EditUserFormProps {
  user: EditUserFormData;
}

export interface EditUserFormData{
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
}

export type LoginState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  success?: boolean;
};

export interface CreateUserState {
  message?: string;
  passwordMatchError?: string;
  success?: boolean;
}

export interface UpdateUserState {
  message?: string;
  Error?: string;
  success?: boolean;
}

export interface CreateUserDto {
  email: string;
  nombre: string;
  apellido: string;
  contrasenia: string;
  telefono?: string;
  direccion?: string;
}

export interface UpdateUserDto {
  email?: string;
  nombre?: string;
  apellido?: string;
  contrasenia?: string;
  telefono?: string;
  direccion?: string;
}

export interface UserStats {
  totalUsers: number;
  totalPets: number;
  totalPublications: number;
  totalVisits: number;
}

export interface FilteredUsersParams {
  query?: string;
  page?: number;
  limit?: number;
  rol_id?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LatestUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
};

export interface UsersTable {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  createdAt?: string;
  status: string;
};

export interface UserForm {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  status: boolean;
};

export interface FilteredUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role_id: number;
  phone?: string;
  address?: string;
  createdAt?: string;
  status: string;
}





