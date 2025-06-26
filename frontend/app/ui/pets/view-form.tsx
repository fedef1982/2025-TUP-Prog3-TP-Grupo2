'use client';

import { lusitana } from '@/app/ui/fonts';
import {
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
import Link from 'next/link';
import { Pet, Species, Condition, Gender, Size } from '@/app/lib/definitionsPets';

export default function ReadOnlyPetForm({ 
  pet, 
  species, 
  conditions 
}: { 
  pet: Pet; 
  species: Species[]; 
  conditions: Condition[] 
}) {
  const currentSpecies = species.find(s => s.id === pet.especie_id);
  const currentCondition = conditions.find(c => c.id === pet.condicion_id);

  return (
    <div className="rounded-md bg-gray-200 p-4 md:p-6">
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        Información de la mascota: {pet.nombre}
      </h1>

      {/* Nombre */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Nombre
        </label>
        <div className="relative mt-2 rounded-md bg-gray-100 p-2">
          <div className="flex items-center">
            <UserIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
            <span>{pet.nombre}</span>
          </div>
        </div>
      </div>

      {/* Raza */}
      {pet.raza && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Raza
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <InformationCircleIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{pet.raza}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sexo */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Sexo
        </label>
        <div className="relative mt-2 rounded-md bg-gray-100 p-2">
          <div className="flex items-center">
            {pet.sexo === Gender.MACHO ? (
              <>
                <MarsIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
                <span>Macho</span>
              </>
            ) : (
              <>
                <VenusIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
                <span>Hembra</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fotos */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Fotos
        </label>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-2">
          {pet.fotos_url.map((img, index) => (
            <div key={index} className="relative h-50 w-full rounded-md overflow-hidden bg-gray-300">
              <img 
                src={img.startsWith('/dashboard/') ? img.replace('/dashboard/', '/images/') : 
                     img.startsWith('/images/') ? img : `/images/${img}`}
                alt={`Foto de ${pet.nombre}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Edad */}
      {pet.edad && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Edad (años)
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <CakeIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{pet.edad} años</span>
            </div>
          </div>
        </div>
      )}

      {/* Vacunado */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Vacunado
        </label>
        <div className="relative mt-2 rounded-md bg-gray-100 p-2">
          <span>{pet.vacunado ? 'Sí' : 'No'}</span>
        </div>
      </div>

      {/* Tamaño */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Tamaño
        </label>
        <div className="relative mt-2 rounded-md bg-gray-100 p-2">
          <span>
            {pet.tamanio === Size.CHICO ? 'Pequeño' : 
             pet.tamanio === Size.MEDIANO ? 'Mediano' : 'Grande'}
          </span>
        </div>
      </div>



      {/* Especie */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Especie
        </label>
        <div className="relative mt-2 rounded-md bg-gray-100 p-2">
          <span>{currentSpecies?.nombre || 'Desconocido'}</span>
        </div>
      </div>

      {/* Condición */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Condición
        </label>
        <div className="relative mt-2 rounded-md bg-gray-100 p-2">
          <span>{currentCondition?.nombre || 'Desconocido'}</span>
        </div>
      </div>

      <Link
        href={`/dashboard/pets/${pet.id}/publications/create`}
        className="mt-4 w-full flex justify-center items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
      >
        Crear Publicación para esta Mascota
      </Link>

      <div className="mt-4 flex justify-center">
        <Link 
          href="/dashboard/pets" 
          className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Volver a mascotas
        </Link>
      </div>
    </div>
  );
}