import { DisponibilidadHoraria } from './create-visita.dto';

export interface TrackingVisita {
  estado: string;
  fecha: Date;
  horario: DisponibilidadHoraria;
}
