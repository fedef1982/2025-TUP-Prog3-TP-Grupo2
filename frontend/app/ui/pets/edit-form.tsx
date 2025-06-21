'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  ExclamationCircleIcon,
  UserIcon,
  PhotoIcon,
  CakeIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import {  
  MarsIcon,
  VenusIcon, 
} from 'lucide-react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { updatePet } from '@/app/lib/actionsPets';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { UpdatePetState, Pet, Species, Condition, Gender, Size } from '@/app/lib/definitionsPets';
import { SpeciesSelect } from './specie-select';
import { ConditionSelect } from './condition-select';
import { ImageUploader } from './image-uploader';
import { useRouter } from 'next/navigation';

export default function EditPetForm({ 
  pet, 
  userId, 
  species, 
  conditions 
}: { 
  pet: Pet; 
  userId: number; 
  species: Species[]; 
  conditions: Condition[] 
}) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [state, formAction] = useActionState<UpdatePetState, FormData>(
    (prevState: UpdatePetState | null, formData: FormData) => 
      updatePet(pet.id, userId, prevState, formData), 
    {
      success: false,
      message: '',
      errors: {}
    }
  );

  const [currentImages, setCurrentImages] = useState<string[]>(() => {
    // Transformar las imágenes iniciales para usar /images/ en lugar de /dashboard/
    return pet.fotos_url.map(img => 
      img.startsWith('/dashboard/') ? img.replace('/dashboard/', '/images/') : 
      img.startsWith('/images/') ? img : `/images/${img}`
    );
  });

  const router = useRouter();

  useEffect(() => {
    if (state?.success && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/dashboard/pets');
    }
  }, [state, router, isRedirecting]);

  const handleImagesUpdate = (newImages: string[]) => {
    setCurrentImages(newImages);
  };

  return (
    <form action={formAction} key={String(state?.success)}>
      <input type="hidden" name="userId" value={userId} />
      <input 
        type="hidden" 
        name="fotos_url" 
        id="fotos_url" 
        value={JSON.stringify(
          currentImages.map(img => img.replace('/images/', ''))
        )} 
      />
      
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Editar mascota: {pet.nombre}
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
                placeholder="Nombre de la mascota"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                defaultValue={pet.nombre}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.nombre && (
              <p className="mt-2 text-sm text-red-500">{state.errors.nombre.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Raza */}
        <div className="mb-4">
          <label htmlFor="raza" className="mb-2 block text-sm font-medium">
            Raza
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="raza"
              name="raza"
              type="text"
              placeholder="Raza de la mascota (opcional)"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={pet.raza || ''}
            />
            <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Sexo */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Sexo <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="sexo"
                value={Gender.MACHO}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
                defaultChecked={pet.sexo === Gender.MACHO}
              />
              <span className="ml-2 flex items-center">
                <MarsIcon className="mr-1 h-4 w-4" /> Macho
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sexo"
                value={Gender.HEMBRA}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
                defaultChecked={pet.sexo === Gender.HEMBRA}
              />
              <span className="ml-2 flex items-center">
                <VenusIcon className="mr-1 h-4 w-4" /> Hembra
              </span>
            </label>
          </div>
          {state?.errors?.sexo && (
            <p className="mt-2 text-sm text-red-500">{state.errors.sexo.join(', ')}</p>
          )}
        </div>

        {/* Edad */}
        <div className="mb-4">
          <label htmlFor="edad" className="mb-2 block text-sm font-medium">
            Edad (años)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="edad"
                name="edad"
                type="number"
                min="0"
                max="30"
                placeholder="Edad en años (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={pet.edad || ''}
              />
              <CakeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Vacunado */}
        <div className="mb-4 flex items-center">
          <input
            id="vacunado"
            name="vacunado"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            defaultChecked={pet.vacunado}
          />
          <label htmlFor="vacunado" className="ml-2 text-sm font-medium">
            ¿Está vacunado?
          </label>
        </div>

        {/* Tamaño */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Tamaño <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tamanio"
                value={Size.CHICO}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
                defaultChecked={pet.tamanio === Size.CHICO}
              />
              <span className="ml-2">Pequeño</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tamanio"
                value={Size.MEDIANO}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
                defaultChecked={pet.tamanio === Size.MEDIANO}
              />
              <span className="ml-2">Mediano</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tamanio"
                value={Size.GRANDE}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
                defaultChecked={pet.tamanio === Size.GRANDE}
              />
              <span className="ml-2">Grande</span>
            </label>
          </div>
          {state?.errors?.tamanio && (
            <p className="mt-2 text-sm text-red-500">{state.errors.tamanio.join(', ')}</p>
          )}
        </div>

        {/* Fotos */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Fotos <span className="text-red-500">*</span>
          </label>
          <ImageUploader 
            userId={userId} 
            initialImages={currentImages}
          />
          {state?.errors?.fotos_url && (
            <p className="mt-2 text-sm text-red-500">{state.errors.fotos_url.join(', ')}</p>
          )}
        </div>

        {/* Especie */}
        <div className="mb-4">
          <label htmlFor="especie_id" className="mb-2 block text-sm font-medium">
            Especie <span className="text-red-500">*</span>
          </label>
          <SpeciesSelect 
            species={species} 
            defaultValue={pet.especie_id.toString()} 
            required
          />
          {state?.errors?.especie_id && (
            <p className="mt-2 text-sm text-red-500">{state.errors.especie_id.join(', ')}</p>
          )}
        </div>

        {/* Condición */}
        <div className="mb-4">
          <label htmlFor="condicion_id" className="mb-2 block text-sm font-medium">
            Condición <span className="text-red-500">*</span>
          </label>
          <ConditionSelect 
            conditions={conditions} 
            defaultValue={pet.condicion_id.toString()} 
            required
          />
          {state?.errors?.condicion_id && (
            <p className="mt-2 text-sm text-red-500">{state.errors.condicion_id.join(', ')}</p>
          )}
        </div>

        <UpdatePetButton />

        <div className="mt-4 flex justify-center">
          <Link 
            href="/dashboard/pets" 
            className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver a mascotas
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

function UpdatePetButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Actualizando...' : 'Actualizar Mascota'} 
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}