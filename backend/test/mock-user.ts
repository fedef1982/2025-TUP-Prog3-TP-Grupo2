import { User } from '../src/usuario/usuario.model';

export const mockUser = {
  id: 1,
  email: 'usuariotest@gmail.com',
  nombre: 'Usuario',
  apellido: 'Test',
  contrasenia: '123456',
  telefono: '1234567890',
  direccion: 'Calle Falsa 123',
  rol_id: 1, // Role.ADMIN
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
} as User;

export const mockUsersArray: User[] = [mockUser];