import { mockDeep } from 'jest-mock-extended';
import { User } from '../../../src/usuario/usuario.model';

export const mockUserData = {
  id: 1,
  email: 'test@mail.com',
  nombre: 'Test',
  apellido: 'Usuario',
  rol_id: 2,
  contrasenia: 'hashedpwd',
  telefono: '123',
  direccion: 'Fake 123',
} as User;

export const mockUserModel = () => mockDeep<typeof User>();
