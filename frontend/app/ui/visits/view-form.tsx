'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  PhoneIcon,
  InformationCircleIcon,
  ArrowLeftIcon,  
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { VisitaEstado, VisitaWithPublication } from '@/app/lib/definitionsVisits';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { approveVisit, rejectVisit } from '@/app/lib/actionsVisits';
import ViewPublishedForm from '../publications/view-form-publica';

function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTimeSlot(timeSlot: string) {
  const timeSlots: Record<string, string> = {
    'MORNING': 'Mañana (9:00 - 12:00)',
    'AFTERNOON': 'Tarde (14:00 - 18:00)',
    'EVENING': 'Noche (19:00 - 21:00)',
    'FULL_DAY': 'Todo el día'
  };
  return timeSlots[timeSlot] || timeSlot;
}

function ActionButtons({
  visitId,
  userId,
  currentState
}: {
  visitId: number;
  userId: number;
  currentState: VisitaEstado;
}) {
  const [approveState, approveAction] = useActionState(
    approveVisit.bind(null, visitId, userId),
    { success: false, message: '', errors: {} }
  );

  const [rejectState, rejectAction] = useActionState(
    rejectVisit.bind(null, visitId, userId),
    { success: false, message: '', errors: {} }
  );

  if (currentState !== VisitaEstado.Pendiente) {
    return (
      <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded-md">
        Esta visita ya ha sido {currentState.toLowerCase()}
      </div>
    );
  }

  return (
    <div className="mt-6 flex gap-4">
      <form action={approveAction}>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Aprobar Visita
        </button>
      </form>

      <form action={rejectAction}>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Rechazar Visita
        </button>
      </form>

      {approveState.message && (
        <div className={`mt-2 text-sm ${approveState.success ? 'text-green-600' : 'text-red-600'}`}>
          {approveState.message}
        </div>
      )}

      {rejectState.message && (
        <div className={`mt-2 text-sm ${rejectState.success ? 'text-green-600' : 'text-red-600'}`}>
          {rejectState.message}
        </div>
      )}
    </div>
  );
}

export default function ViewVisitForm({
  visit,
  userId,
}: {
  visit: VisitaWithPublication;
  userId: number;
}) {
  return (
    <div className="rounded-md bg-gray-200 p-4 md:p-6">
      <div className="mb-6">
        <h1 className={`${lusitana.className} mb-2 text-2xl`}>
          Solicitud de Visita
        </h1>
        <div className="text-sm text-gray-500">
          Estado: <span className="font-medium">{visit.estado}</span>
          <span className="ml-4">• Tracking: {visit.tracking}</span>
        </div>
      </div>

      {/* Visit Information */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Visitante
        </label>
        <div className="flex items-center rounded-md bg-gray-100 p-3">
          <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
          <span>{visit.nombre} {visit.apellido}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Información de contacto
        </label>
        <div className="grid gap-2">
          <div className="flex items-center rounded-md bg-gray-100 p-3">
            <EnvelopeIcon className="mr-2 h-5 w-5 text-gray-500" />
            <span>{visit.email}</span>
          </div>
          <div className="flex items-center rounded-md bg-gray-100 p-3">
            <PhoneIcon className="mr-2 h-5 w-5 text-gray-500" />
            <span>{visit.telefono}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Disponibilidad
        </label>
        <div className="grid gap-2">
          <div className="flex items-center rounded-md bg-gray-100 p-3">
            <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
            <span>{formatDate(visit.disponibilidad_fecha)}</span>
          </div>
          <div className="flex items-center rounded-md bg-gray-100 p-3">
            <ClockIcon className="mr-2 h-5 w-5 text-gray-500" />
            <span>{formatTimeSlot(visit.disponibilidad_horario)}</span>
          </div>
        </div>
      </div>

      {visit.descripcion && (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Mensaje adicional
          </label>
          <div className="flex rounded-md bg-gray-100 p-3">
            <InformationCircleIcon className="mr-2 h-5 w-5 text-gray-500" />
            <p className="whitespace-pre-line">{visit.descripcion}</p>
          </div>
        </div>
      )}

      {/* Publication Information Section */}
      <div className="mb-6 mt-8">
        <h2 className={`${lusitana.className} mb-4 text-xl`}>
          Información de la Publicación
        </h2>
        <ViewPublishedForm publication={visit.publicacion} />
      </div>

        <ActionButtons 
          visitId={visit.id} 
          userId={userId} 
          currentState={visit.estado} 
        />
  

      <div className="mt-6">
        <Link 
          href="/dashboard/visits" 
          className="flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-violet-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Volver a visitas
        </Link>
      </div>
    </div>
  );
}