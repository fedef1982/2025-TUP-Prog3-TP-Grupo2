'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  MapPinIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { VisitaWithPublication } from '@/app/lib/definitionsVisits';
import { Button } from '@/app/ui/button';
import { useFormStatus } from 'react-dom';
import { approveVisit, rejectVisit } from '@/app/lib/actionsVisits';

function ApproveButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full bg-green-600 hover:bg-green-500"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Procesando...' : 'Aprobar Visita'}
    </Button>
  );
}

function RejectButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full bg-red-600 hover:bg-red-500"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Procesando...' : 'Rechazar Visita'}
    </Button>
  );
}

export default function ViewVisitForm({ 
  visit,
  userId,
  rol_id
}: { 
  visit: VisitaWithPublication;
  userId: number;
  rol_id: number;
}) {
  const isAdmin = rol_id === 1;
  const isPending = visit.estado === 'Pendiente';

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeSlot = (timeSlot: string) => {
    switch(timeSlot) {
      case 'Maniana': return 'Mañana (9:00-12:00)';
      case 'Tarde': return 'Tarde (14:00-18:00)';
      case 'Noche': return 'Noche (19:00-21:00)';
      default: return timeSlot;
    }
  };

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
        
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Título
          </label>
          <div className="flex items-center rounded-md bg-gray-100 p-3">
            <DocumentTextIcon className="mr-2 h-5 w-5 text-gray-500" />
            <span>{visit.publicacion?.titulo || 'Publicación no disponible'}</span>
          </div>
        </div>

        {visit.publicacion?.descripcion && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Descripción
            </label>
            <div className="flex rounded-md bg-gray-100 p-3">
              <InformationCircleIcon className="mr-2 h-5 w-5 text-gray-500" />
              <p className="whitespace-pre-line">{visit.publicacion.descripcion}</p>
            </div>
          </div>
        )}

        {visit.publicacion?.ubicacion && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Ubicación
            </label>
            <div className="flex items-center rounded-md bg-gray-100 p-3">
              <MapPinIcon className="mr-2 h-5 w-5 text-gray-500" />
              <span>{visit.publicacion.ubicacion}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {isAdmin && isPending && (
          <div className="grid grid-cols-2 gap-4">
            <form action={() => approveVisit(visit.id, userId)}>
              <ApproveButton />
            </form>
            <form action={() => rejectVisit(visit.id, userId)}>
              <RejectButton />
            </form>
          </div>
        )}
        
        <Link 
          href="/dashboard/visits" 
          className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Volver a visitas
        </Link>
      </div>
    </div>
  );
}