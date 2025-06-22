import { mockDeep } from 'jest-mock-extended';
import { Especie } from '../../src/mascota/especie/especie.model';

export const mockEspecieData: Especie = {
  id: 1,
  nombre: 'Perro',
} as Especie;

export const mockEspecieModel = () => mockDeep<typeof Especie>();
