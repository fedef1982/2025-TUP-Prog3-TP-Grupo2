import { mockDeep } from 'jest-mock-extended';
import { Mascota } from '../../../src/mascota/mascota.model';

export const mockMascotaData: Mascota = {
  id: 10,
  nombre: 'Chai',
  raza: 'Labrador',
  sexo: 'Macho',
  edad: 3,
  vacunado: true,
  tamanio: 'Grande',
} as Mascota;

export const mockMascotaModel = () => mockDeep<typeof Mascota>();
