import { mockDeep } from 'jest-mock-extended';
import { Condicion } from '../../src/mascota/condicion/condicion.model';

export const mockCondicionData: Condicion = {
  id: 1,
  nombre: 'Refugio',
  descripcion: 'El animal se encuentra en un refugio',
} as Condicion;

export const mockCondicionModel = () => mockDeep<typeof Condicion>();
