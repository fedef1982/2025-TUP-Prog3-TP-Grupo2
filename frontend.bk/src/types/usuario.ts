export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  contrasenia: string;
  role: string;
  telefono?: string;
  direccion?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}