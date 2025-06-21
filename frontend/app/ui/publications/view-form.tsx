'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  DocumentTextIcon,
  MapPinIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  UserIcon,
  PhotoIcon,
  CakeIcon,
} from '@heroicons/react/24/outline';
import {  
  MarsIcon,
  VenusIcon, 
} from 'lucide-react';
import Link from 'next/link';
import { Pet, Species, Condition, Gender, Size } from '@/app/lib/definitionsPets';
import { PublicationWithPet } from '@/app/lib/definitionsPublications';
import PublicationStatus from '@/app/ui/publications/status';

export default function PublicationDetailView({ 
  publication,
  species,
  conditions
}: { 
  publication: PublicationWithPet;
  species: Species[];
  conditions: Condition[];
}) {
  const pet = publication.mascota;
  const currentSpecies = species.find(s => s.id === pet.especie_id);
  const currentCondition = conditions.find(c => c.id === pet.condicion_id);

  return (
    <div className="space-y-6">
      {/* Publication Information Section */}
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Detalles de la Publicación: {publication.titulo}
        </h1>

        {/* Publication Status */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Estado
          </label>
          <div className="mt-2">
            <PublicationStatus 
              status={publication.estado} 
              published={publication.publicado} 
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Título
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <DocumentTextIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{publication.titulo}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Descripción
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-3">
            <div className="flex items-start">
              <InformationCircleIcon className="mr-2 h-[18px] w-[18px] text-gray-500 mt-0.5" />
              <p className="whitespace-pre-line">{publication.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Ubicación
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <MapPinIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{publication.ubicacion}</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Contacto
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <PhoneIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{publication.contacto}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Fecha de Creación
            </label>
            <div className="relative mt-2 rounded-md bg-gray-100 p-2">
              <span>
                {new Date(publication.createdAt).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
          {publication.publicado && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Fecha de Publicación
              </label>
              <div className="relative mt-2 rounded-md bg-gray-100 p-2">
                <span>
                  {new Date(publication.publicado).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pet Information Section */}
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h2 className={`${lusitana.className} mb-4 text-xl`}>
          Información de la Mascota
        </h2>

        {/* Pet Name and Photos */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3">
              <div className="grid grid-cols-2 gap-2">
                {pet.fotos_url.slice(0, 2).map((img, index) => (
                  <div key={index} className="relative h-32 w-full rounded-md overflow-hidden bg-gray-300">
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
            <div className="md:w-2/3">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Especie
                  </label>
                  <div className="relative mt-2 rounded-md bg-gray-100 p-2">
                    <span>{currentSpecies?.nombre || 'Desconocido'}</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Condición
                  </label>
                  <div className="relative mt-2 rounded-md bg-gray-100 p-2">
                    <span>{currentCondition?.nombre || 'Desconocido'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Breed */}
          {pet.raza && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Raza
              </label>
              <div className="relative mt-2 rounded-md bg-gray-100 p-2">
                <span>{pet.raza}</span>
              </div>
            </div>
          )}

          {/* Gender */}
          <div>
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

          {/* Age */}
          {pet.edad && (
            <div>
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

          {/* Vaccinated */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Vacunado
            </label>
            <div className="relative mt-2 rounded-md bg-gray-100 p-2">
              <span>{pet.vacunado ? 'Sí' : 'No'}</span>
            </div>
          </div>

          {/* Size */}
          <div>
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
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Link 
          href="/dashboard/publications" 
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Volver a publicaciones
        </Link>
      </div>
    </div>
  );
}