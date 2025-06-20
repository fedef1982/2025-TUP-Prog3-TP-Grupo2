import { mockDeep } from 'jest-mock-extended';
import { Publicacion } from '../../../src/publicacion/publicacion.model';

export const mockPublicacionData = {
  id: 100,
  titulo: 'Adopción urgente',
} as Publicacion;

export const mockPublicacionModel = () => mockDeep<typeof Publicacion>();
