'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { fetchTrackingVisit } from '@/app/lib/dataVisits';
import { SearchTrackingState } from '@/app/lib/definitionsVisits';

export default function SearchTrackingForm() {
  const initialState: SearchTrackingState = {
    message: '',
    errors: undefined,
    success: undefined,
    tracking: undefined,
  };

  const [state, formAction] = useActionState<SearchTrackingState, FormData>(
    async (_prevState, formData) => {
      const tracking = formData.get('tracking') as string;
      try {
        const trackingData = await fetchTrackingVisit(tracking);
        return {
          success: true,
          message: '',
          tracking: trackingData,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'No se encontró la visita',
          tracking: undefined,
        };
      }
    },
    initialState
  );

  function formatFecha(fecha?: Date | string) {
    if (!fecha) return '';
    const d = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return d.toLocaleDateString();
  }

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-200 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Ingresá el tracking de la visita para verificar el estado.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="tracking"
            >
              Tracking
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="tracking"
                type="text"
                name="tracking"
                placeholder="Ingrese el tracking"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.tracking && (
              <p className="mt-2 text-sm text-red-500">
                {state.errors.tracking.join(', ')}
              </p>
            )}
          </div>
        </div>
        <SearchTrackingButton />

        {state?.message && !state.success && (
          <div className="flex h-8 items-end space-x-1 mt-3" aria-live="polite" aria-atomic="true">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{state.message}</p>
          </div>
        )}

        {state?.success && state.tracking && (
          <div className="mt-6 rounded-md bg-green-100 p-4 text-green-900">
            <p className="mb-1 font-semibold">
              Estado: <span className="font-normal">{state.tracking.estado}</span>
            </p>
            <p className="mb-1 font-semibold">
              Fecha: <span className="font-normal">{formatFecha(state.tracking.fecha)}</span>
            </p>
            <p className="mb-1 font-semibold">
              Horario: <span className="font-normal">{state.tracking.horario}</span>
            </p>
          </div>
        )}
      </div>
    </form>
  );
}

function SearchTrackingButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full"
      aria-disabled={pending}
      disabled={pending}
    >
      Buscar <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}