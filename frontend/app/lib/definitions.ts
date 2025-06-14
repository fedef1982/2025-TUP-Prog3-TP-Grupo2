// Primero, actualicemos los tipos para que coincidan con la estructura de la API
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role_id: number;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type LatestUser = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
};

export type LatestUserRaw = Omit<LatestUser, 'status'> & {
  status: boolean; // La API usa boolean, lo convertimos a 'active'|'inactive'
};

export type UsersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  phone: string;
  role: string;
  createdAt: string;
  status: 'active' | 'inactive';
};

export type UserForm = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role_id: number;
  status: boolean;
};

export interface FilteredUser {
  id: string;
  name: string;
  email: string;
  amount: number;       // Nuevo campo
  date: string;        // Nuevo campo
  status: 'pending' | 'paid' | 'active' | 'inactive'; // Ampliado
  lastLogin?: string;
  role?: string;
  imageUrl: string;
}

export type UserStatus = 'pending' | 'paid' | 'active' | 'inactive'; // Tipo para status
