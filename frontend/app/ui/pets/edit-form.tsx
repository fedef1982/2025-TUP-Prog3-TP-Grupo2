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
import { Button } from '@/app/ui/button';
import { useActionState, useEffect } from 'react';
import { updatePet } from '@/app/lib/actionsPets';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { UpdatePetState, Pet, Species, Condition } from '@/app/lib/definitionsPets';
import { SpeciesSelect } from './specie-select';
import { ConditionSelect } from './condition-select';
import { ImageUploader } from './image-uploader';


interface EditPetFormProps {
  pet: Pet;
  userId: number;
  species: Species[];
  conditions: Condition[];
}

export default function EditPetForm({ 
  pet, 
  userId,
  species,
  conditions
}: EditPetFormProps) {
  const [state, formAction] = useActionState<UpdatePetState, FormData>(
    (prevState, formData) => updatePet(pet.id, userId, prevState, formData),
    {}
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard/pets');
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Editar información de mascota
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
                defaultValue={pet.nombre}
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
              defaultValue={pet.raza || ''}
              placeholder="Raza de la mascota (opcional)"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                value="Macho"
                defaultChecked={pet.sexo === 'Macho'}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
              />
              <span className="ml-2 flex items-center">
                <MarsIcon className="mr-1 h-4 w-4" /> Macho
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sexo"
                value="Hembra"
                defaultChecked={pet.sexo === 'Hembra'}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
              />
              <span className="ml-2 flex items-center">
                <VenusIcon className="mr-1 h-4 w-4" /> Hembra
              </span>
            </label>
          </div>
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
                defaultValue={pet.edad || ''}
                placeholder="Edad en años (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
            defaultChecked={pet.vacunado}
            className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
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
                value="Chico"
                defaultChecked={pet.tamanio === 'Chico'}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
              />
              <span className="ml-2">Pequeño</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tamanio"
                value="Mediano"
                defaultChecked={pet.tamanio === 'Mediano'}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
              />
              <span className="ml-2">Mediano</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tamanio"
                value="Grande"
                defaultChecked={pet.tamanio === 'Grande'}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                required
              />
              <span className="ml-2">Grande</span>
            </label>
          </div>
        </div>

        {/* Fotos */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Fotos <span className="text-red-500">*</span>
          </label>
          <ImageUploader initialImages={pet.fotos_url} />
          <input 
            type="hidden" 
            name="fotos_url" 
            id="fotos_url" 
            defaultValue={JSON.stringify(pet.fotos_url)}
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
          <select
            id="especie_id"
            name="especie_id"
            defaultValue={pet.especie_id.toString()}
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-2 placeholder:text-gray-500"
            required
            aria-describedby="especie-error"
          >
            <option value="" disabled>Seleccione una especie</option>
            {species.map((specie) => (
              <option key={specie.id} value={specie.id}>
                {specie.nombre}
              </option>
            ))}
          </select>
          {state?.errors?.especie_id && (
            <div id="especie-error" className="mt-2 text-sm text-red-500">
              {state.errors.especie_id.join(', ')}
            </div>
          )}
        </div>

        {/* Condición */}
        <div className="mb-4">
          <label htmlFor="condicion_id" className="mb-2 block text-sm font-medium">
            Condición <span className="text-red-500">*</span>
          </label>
          <select
            id="condicion_id"
            name="condicion_id"
            defaultValue={pet.condicion_id.toString()}
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-2 placeholder:text-gray-500"
            required
            aria-describedby="condicion-error"
          >
            <option value="" disabled>Seleccione una condición</option>
            {conditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.nombre}
              </option>
            ))}
          </select>
          {state?.errors?.condicion_id && (
            <div id="condicion-error" className="mt-2 text-sm text-red-500">
              {state.errors.condicion_id.join(', ')}
            </div>
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

        <div aria-live="polite" aria-atomic="true">
          {state?.message && !state.success && (
            <p className="mt-2 flex items-center text-sm text-red-500">
              <ExclamationCircleIcon className="mr-1 h-5 w-5" />
              {state.message}
            </p>
          )}
        </div>
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
    </Button>
  );
}