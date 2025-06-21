import { mockDeep } from 'jest-mock-extended';
import { Visita } from '../../src/visita/visita.model';
import { DisponibilidadHoraria } from '../../src/visita/dto/create-visita.dto';

export const mockVisitaData = {
  id: 100,
  nombre: 'Juan',
  apellido: 'Pérez',
  telefono: '111',
  email: 'test@gmail.com',
  disponibilidad_fecha: new Date('2025-06-19T10:00:00Z'),
  disponibilidad_horario: DisponibilidadHoraria.Maniana,
  descripcion: 'quiero adoptar',
} as Visita;

export const mockVisitaModel = () => mockDeep<typeof Visita>();
