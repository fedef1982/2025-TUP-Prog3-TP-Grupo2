import { mockDeep } from 'jest-mock-extended';
import { Visita } from '../../../src/visita/visita.model';

export const mockVisitaData = {
  id: 100,
  estado: 'Pendiente',
  nombre: 'Felipe',
} as Visita;

export const mockVisitaModel = () => mockDeep<typeof Visita>();
