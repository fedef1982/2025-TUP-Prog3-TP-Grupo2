'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  ExclamationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { createPublication } from '@/app/lib/actionsPublications';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { CreatePublicationState } from '@/app/lib/definitionsPublications';
import { useRouter } from 'next/navigation';
import { fetchAllPets } from '@/app/lib/dataPets';
import { Pet } from '@/app/lib/definitionsPets';
import { PetSelect } from './pet-select';

export default function CreatePublicationForm({ userId }: { userId: number }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, formAction] = useActionState<CreatePublicationState, FormData>(createPublication, {
    success: false,
    message: '',
    errors: {}
  });

  const router = useRouter();

  useEffect(() => {
    async function loadPets() {
      try {
        const petsData = await fetchAllPets();
        setPets(petsData);
      } catch (error) {
        console.error('Error loading pets:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, []);

  useEffect(() => {
    if (state?.success && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/dashboard/publications');
      router.refresh(); 
    }
  }, [state, router, isRedirecting]);

  if (loading) {
    return (
      <div className="rounded-md bg-gray-200 p-4 md:p-6 flex justify-center items-center h-64">
        <p>Loading form...</p>
      </div>
    );
  }
  
  return (
    <form action={formAction} key={String(state?.success)}>
      <input type="hidden" name="userId" value={userId} />
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Crear una nueva Publicación
        </h1>

        {/* Titulo */}
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
                placeholder="Publication título"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.titulo && (
              <p className="mt-2 text-sm text-red-500">{state.errors.titulo.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">
            Descripción <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              placeholder="Descripción de la publicación"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <InformationCircleIcon className="pointer-events-none absolute left-3 top-4 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
          </div>
          {state?.errors?.descripcion && (
            <p className="mt-2 text-sm text-red-500">{state.errors.descripcion.join(', ')}</p>
          )}
        </div>

        {/* Ubicación */}
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
                placeholder="Donde esta la mascota Ubicación?"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.ubicacion && (
              <p className="mt-2 text-sm text-red-500">{state.errors.ubicacion.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Contacto */}
        <div className="mb-4">
          <label htmlFor="contacto" className="mb-2 block text-sm font-medium">
            Información de contacto <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="contacto"
                name="contacto"
                type="text"
                placeholder="Telefono o email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.contacto && (
              <p className="mt-2 text-sm text-red-500">{state.errors.contacto.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Seleccion de mascota */}
        <div className="mb-4">
          <label htmlFor="mascota_id" className="mb-2 block text-sm font-medium">
            Elijá una mascota <span className="text-red-500">*</span>
          </label>
          <PetSelect 
            userId={userId}
            required
          />
          {state?.errors?.mascota_id && (
            <p className="mt-2 text-sm text-red-500">{state.errors.mascota_id.join(', ')}</p>
          )}
        </div>

        <CreatePublicationButton />

        <div className="mt-4 flex justify-center">
          <Link 
            href="/dashboard/publications" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver a publicaciones
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

function CreatePublicationButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full bg-blue-600 hover:bg-blue-500"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Creating...' : 'Create Publication'} 
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}