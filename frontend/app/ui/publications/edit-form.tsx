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
    }
  }, [state, router, isRedirecting]);

  return (
    <form action={formAction} key={String(state?.success)}>
      <input type="hidden" name="userId" value={userId} />
      
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Edit Publication: {publication.titulo}
        </h1>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="titulo" className="mb-2 block text-sm font-medium">
            Title <span className="text-red-500">*</span>
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
                defaultValue={publication.titulo}
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.titulo && (
              <p className="mt-2 text-sm text-red-500">{state.errors.titulo.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              placeholder="Detailed description of the publication"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              defaultValue={publication.descripcion}
            />
            <InformationCircleIcon className="pointer-events-none absolute left-3 top-4 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
          </div>
          {state?.errors?.descripcion && (
            <p className="mt-2 text-sm text-red-500">{state.errors.descripcion.join(', ')}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="ubicacion" className="mb-2 block text-sm font-medium">
            Location <span className="text-red-500">*</span>
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
                defaultValue={publication.ubicacion}
              />
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.ubicacion && (
              <p className="mt-2 text-sm text-red-500">{state.errors.ubicacion.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <label htmlFor="contacto" className="mb-2 block text-sm font-medium">
            Contact Information <span className="text-red-500">*</span>
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
                defaultValue={publication.contacto}
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.contacto && (
              <p className="mt-2 text-sm text-red-500">{state.errors.contacto.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Pet Selection */}
        <div className="mb-4">
          <label htmlFor="mascota_id" className="mb-2 block text-sm font-medium">
            Pet <span className="text-red-500">*</span>
          </label>
          <PetSelect 
            userId={userId}
            defaultValue={publication.mascota_id.toString()}
            required
          />
          {state?.errors?.estado && (
            <p className="mt-2 text-sm text-red-500">{state.errors.estado.join(', ')}</p>
          )}
        </div>

        {/* Publication Status */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="estado"
                value="Abierta"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={publication.estado === 'Abierta'}
              />
              <span className="ml-2">Open</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="estado"
                value="Cerrada"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={publication.estado === 'Cerrada'}
              />
              <span className="ml-2">Closed</span>
            </label>
          </div>
          {state?.errors?.estado && (
            <p className="mt-2 text-sm text-red-500">{state.errors.estado.join(', ')}</p>
          )}
        </div>

        <UpdatePublicationButton />

        <div className="mt-4 flex justify-center">
          <Link 
            href="/dashboard/publications" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to Publications
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

function UpdatePublicationButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full bg-blue-600 hover:bg-blue-500"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Updating...' : 'Update Publication'} 
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}