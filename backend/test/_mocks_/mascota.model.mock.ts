import { mockDeep } from 'jest-mock-extended';
import { Mascota } from '../../src/mascota/mascota.model';
import { Sexo, Tamanio } from '../../src/mascota/dto/create-mascota.dto';

export const mockMascotaData: Mascota = {
  id: 10,
  nombre: 'Chai',
  raza: 'Labrador',
  sexo: Sexo.Macho,
  edad: 3,
  vacunado: true,
  tamanio: Tamanio.Grande,
} as Mascota;

export const mockMascotaModel = () => mockDeep<typeof Mascota>();
