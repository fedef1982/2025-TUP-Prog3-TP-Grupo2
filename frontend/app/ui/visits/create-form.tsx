'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  ExclamationCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { createVisit } from '@/app/lib/actionsVisits';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { CreateVisitaState } from '@/app/lib/definitionsVisits';
import { useRouter } from 'next/navigation';

export default function CreateVisitForm({ publicationId }: { publicationId: number }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [state, formAction] = useActionState<CreateVisitaState, FormData>(
    async (prevState, formData) => {
      // Extraer publicationId del formData
      const pubId = formData.get('publicationId');
      return createVisit(prevState, formData, Number(pubId));
    }, 
    {
      success: false,
      message: '',
      errors: {},
      trackingId: ''
    }
  );


  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.trackingId && !isRedirecting) {
      setIsRedirecting(true);
      router.push(`/visits/tracking/${state.trackingId}`);
      router.refresh();
    }
  }, [state, router, isRedirecting]);

  return (
    <form action={formAction} key={String(state?.success)}>
      <input type="hidden" name="publicationId" value={publicationId} />
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Solicitar Visita
        </h1>

        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
            Nombre <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.nombre && (
              <p className="mt-2 text-sm text-red-500">{state.errors.nombre.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Apellido */}
        <div className="mb-4">
          <label htmlFor="apellido" className="mb-2 block text-sm font-medium">
            Apellido <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Tu apellido"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.apellido && (
              <p className="mt-2 text-sm text-red-500">{state.errors.apellido.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Teléfono */}
        <div className="mb-4">
          <label htmlFor="telefono" className="mb-2 block text-sm font-medium">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="Número de teléfono"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.telefono && (
              <p className="mt-2 text-sm text-red-500">{state.errors.telefono.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Tu email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.email && (
              <p className="mt-2 text-sm text-red-500">{state.errors.email.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Fecha de disponibilidad */}
        <div className="mb-4">
          <label htmlFor="disponibilidad_fecha" className="mb-2 block text-sm font-medium">
            Fecha disponible <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="disponibilidad_fecha"
                name="disponibilidad_fecha"
                type="date"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.disponibilidad_fecha && (
              <p className="mt-2 text-sm text-red-500">{state.errors.disponibilidad_fecha.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Horario de disponibilidad */}
        <div className="mb-4">
          <label htmlFor="disponibilidad_horario" className="mb-2 block text-sm font-medium">
            Horario disponible <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="disponibilidad_horario"
                name="disponibilidad_horario"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
                required
              >
                <option value="">Selecciona un horario</option>
                <option value="Maniana">Mañana (9:00 - 12:00)</option>
                <option value="Tarde">Tarde (14:00 - 18:00)</option>
                <option value="Noche">Noche (19:00 - 21:00)</option>
              </select>
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.disponibilidad_horario && (
              <p className="mt-2 text-sm text-red-500">{state.errors.disponibilidad_horario.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">
            Mensaje adicional (opcional)
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              placeholder="Algo que quieras comentar sobre la visita..."
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <InformationCircleIcon className="pointer-events-none absolute left-3 top-4 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        <CreateVisitButton />

        <div className="mt-4 flex justify-center">
          <Link 
            href={`/publications/${publicationId}`} 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver a la publicación
          </Link>
        </div>

        {state?.message && !state.success && (
          <p className="mt-2 flex items-center text-sm text-red-500">
            <ExclamationCircleIcon className="mr-1 h-5 w-5" />
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function CreateVisitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full bg-blue-600 hover:bg-blue-500"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Enviando...' : 'Solicitar Visita'} 
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}