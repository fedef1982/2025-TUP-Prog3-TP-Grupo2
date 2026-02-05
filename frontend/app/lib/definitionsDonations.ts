// Definiciones para usuarios

export interface Donation {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  contrasenia: string;
  telefono?: string;
  direccion?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface EditDonationFormProps {
  user: EditDonationFormData;
}

export interface EditDonationFormData{
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
}

export interface CreateDonationState {
  message?: string;
  passwordMatchError?: string;
  success?: boolean;
}

export interface UpdateDonationState {
  message?: string;
  Error?: string;
  success?: boolean;
}

export interface CreateDonationDto {
  email: string;
  nombre: string;
  apellido: string;
  contrasenia: string;
  telefono?: string;
  direccion?: string;
}


export interface UpdateDonationDto {
  email?: string;
  nombre?: string;
  apellido?: string;
  contrasenia?: string;
  telefono?: string;
  direccion?: string;
}

export interface FilteredDonationsParams {
  query?: string;
  page?: number;
  limit?: number;
  rol_id?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DonationsTable {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  createdAt?: string;
  status: string;
};

export interface DonationForm {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  address?: string;
  status: boolean;
};

export interface FilteredDonations {
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
