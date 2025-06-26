'use client';
import { lusitana } from '@/app/ui/fonts';
import {
  ExclamationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { updatePublication } from '@/app/lib/actionsPublications';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { UpdatePublicationState, PublicationWithPet } from '@/app/lib/definitionsPublications';
import { useRouter } from 'next/navigation';
import { PetSelect } from './pet-select';
import { Pet } from '@/app/lib/definitionsPets';

export default function EditPublicationForm({ 
  publication, 
  userId, 
  pets 
}: { 
  publication: PublicationWithPet; 
  userId: number; 
  pets: Pet[] 
}) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [state, formAction] = useActionState<UpdatePublicationState, FormData>(
    (prevState: UpdatePublicationState | null, formData: FormData) => 
      updatePublication(publication.id, userId, prevState, formData), 
    {
      success: false,
      message: '',
      errors: {}
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (state?.success && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/dashboard/publications');
      router.refresh(); 
    }
  }, [state, router, isRedirecting]);

  return (
    <form action={formAction} key={String(state?.success)}>
      <input type="hidden" name="userId" value={userId} />
      
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Editar Publicación: {publication.titulo}
        </h1>

        {state?.success && (
          <div className="mb-4 flex items-center rounded-md bg-green-100 p-4 text-green-700">
            <CheckCircleIcon className="mr-2 h-5 w-5" />
            <p>{state.message || 'Publicación actualizada exitosamente!'}</p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="titulo" className="mb-2 block text-sm font-medium">
            Título <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="titulo"
                name="titulo"
                type="text"
                placeholder="Publication title"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                minLength={3}
                maxLength={100}
                defaultValue={publication.titulo}
                aria-describedby="titulo-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.titulo && (
              <p id="titulo-error" className="mt-2 text-sm text-red-500">
                {state.errors.titulo.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">
            Descripción <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              placeholder="Detailed description of the publication"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              minLength={10}
              maxLength={500}
              defaultValue={publication.descripcion}
              aria-describedby="descripcion-error"
            />
            <InformationCircleIcon className="pointer-events-none absolute left-3 top-4 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
          </div>
          {state?.errors?.descripcion && (
            <p id="descripcion-error" className="mt-2 text-sm text-red-500">
              {state.errors.descripcion.join(', ')}
            </p>
          )}
        </div>
        {/* Ubication */}
        <div className="mb-4">
          <label htmlFor="ubicacion" className="mb-2 block text-sm font-medium">
            Ubicación <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="ubicacion"
                name="ubicacion"
                type="text"
                placeholder="Where is the pet located?"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                minLength={3}
                maxLength={100}
                defaultValue={publication.ubicacion}
                aria-describedby="ubicacion-error"
              />
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.ubicacion && (
              <p id="ubicacion-error" className="mt-2 text-sm text-red-500">
                {state.errors.ubicacion.join(', ')}
              </p>
            )}
          </div>
        </div>
          {/* Contact */}
        <div className="mb-4">
          <label htmlFor="contacto" className="mb-2 block text-sm font-medium">
            Informacion de contacto <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="contacto"
                name="contacto"
                type="text"
                placeholder="Phone number or email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                minLength={5}
                maxLength={50}
                defaultValue={publication.contacto}
                aria-describedby="contacto-error"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.contacto && (
              <p id="contacto-error" className="mt-2 text-sm text-red-500">
                {state.errors.contacto.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Pet Selection 
        <div className="mb-4">
          <label htmlFor="mascota_id" className="mb-2 block text-sm font-medium">
            Mascota <span className="text-red-500">*</span>
          </label>
          <PetSelect 
            userId={userId}
            defaultValue={publication.mascota_id.toString()}
            required
          />
          {state?.errors?.estado && (
            <p className="mt-2 text-sm text-red-500">
              {state.errors.estado.join(', ')}
            </p>
          )}
        </div>*/}
        {/* Estado */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Estado <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="estado"
                value="Abierta"
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-blue-500"
                defaultChecked={publication.estado === 'Abierta'}
                aria-describedby="estado-error"
              />
              <span className="ml-2">Abierta</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="estado"
                value="Cerrada"
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-blue-500"
                defaultChecked={publication.estado === 'Cerrada'}
                aria-describedby="estado-error"
              />
              <span className="ml-2">Cerrada</span>
            </label>
          </div>
          {state?.errors?.estado && (
            <p id="estado-error" className="mt-2 text-sm text-red-500">
              {state.errors.estado.join(', ')}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <UpdatePublicationButton />
        </div>
        <div className="mt-4 flex justify-center">
          <Link 
            href="/dashboard/publications" 
            className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver a publicaciones
          </Link>
        </div>

        {state?.message && !state.success && (
          <div className="mt-4 flex items-center rounded-md bg-red-100 p-4 text-red-700">
            <ExclamationCircleIcon className="mr-2 h-5 w-5" />
            <p>{state.message}</p>
          </div>
        )}
      </div>
    </form>
  );
}

function UpdatePublicationButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full bg-blue-600 hover:bg-blue-500"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center justify-center">
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Updating...
        </span>
      ) : (
        <>
          Actualizar Publicación
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </>
      )}
    </Button>
  );
}