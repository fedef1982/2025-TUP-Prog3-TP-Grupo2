'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  MapPinIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  PhotoIcon,
  CakeIcon,
} from '@heroicons/react/24/outline';
import {  
  MarsIcon,
  VenusIcon, 
} from 'lucide-react';
import Link from 'next/link';
import { PublicationWithPet } from '@/app/lib/definitionsPublications';
import { Gender, Size } from '@/app/lib/definitionsPets';

export default function ViewPublicationForm({ 
  publication 
}: { 
  publication: PublicationWithPet;
}) {
  return (
    <div className="rounded-md bg-gray-200 p-4 md:p-6">
      <div className="mb-6">
        <h1 className={`${lusitana.className} mb-2 text-2xl`}>
          {publication.titulo}
        </h1>
        <div className="text-sm text-gray-500">
          Estado: <span className="font-medium">{publication.estado}</span>
          {publication.publicado && (
            <span className="ml-4">• Publicado</span>
          )}
        </div>
      </div>

      {/* Publication Information */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Título
        </label>
        <div className="flex items-center rounded-md bg-gray-100 p-3">
          <DocumentTextIcon className="mr-2 h-5 w-5 text-gray-500" />
          <span>{publication.titulo}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Descripción
        </label>
        <div className="flex rounded-md bg-gray-100 p-3">
          <InformationCircleIcon className="mr-2 h-5 w-5 text-gray-500" />
          <p className="whitespace-pre-line">{publication.descripcion}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Ubicación
        </label>
        <div className="flex items-center rounded-md bg-gray-100 p-3">
          <MapPinIcon className="mr-2 h-5 w-5 text-gray-500" />
          <span>{publication.ubicacion}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Información de contacto
        </label>
        <div className="flex items-center rounded-md bg-gray-100 p-3">
          <PhoneIcon className="mr-2 h-5 w-5 text-gray-500" />
          <span>{publication.contacto}</span>
        </div>
      </div>

      {/* Pet Information Section */}
      <div className="mb-6 mt-8">
        <h2 className={`${lusitana.className} mb-4 text-xl`}>
          Información de la Mascota
        </h2>
        
        {/* Nombre */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Nombre
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <UserIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{publication.mascota.nombre}</span>
            </div>
          </div>
        </div>

        {/* Raza */}
        {publication.mascota.raza && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Raza
            </label>
            <div className="relative mt-2 rounded-md bg-gray-100 p-2">
              <div className="flex items-center">
                <InformationCircleIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
                <span>{publication.mascota.raza}</span>
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
              {publication.mascota.sexo === Gender.MACHO ? (
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {publication.mascota.fotos_url.map((img, index) => (
              <div key={index} className="relative h-40 w-full rounded-md overflow-hidden bg-gray-300">
                <img 
                  src={img.startsWith('/dashboard/') ? img.replace('/dashboard/', '/images/') : 
                       img.startsWith('/images/') ? img : `/images/${img}`}
                  alt={`Foto de ${publication.mascota.nombre}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Edad */}
        {publication.mascota.edad && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Edad (años)
            </label>
            <div className="relative mt-2 rounded-md bg-gray-100 p-2">
              <div className="flex items-center">
                <CakeIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
                <span>{publication.mascota.edad} años</span>
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
            <span>{publication.mascota.vacunado ? 'Sí' : 'No'}</span>
          </div>
        </div>

        {/* Tamaño */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Tamaño
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <span>
              {publication.mascota.tamanio === Size.CHICO ? 'Pequeño' : 
               publication.mascota.tamanio === Size.MEDIANO ? 'Mediano' : 'Grande'}
            </span>
          </div>
        </div>

        {/* Especie */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Especie
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <span>{publication.mascota.especie?.nombre || 'Desconocido'}</span>
          </div>
        </div>

        {/* Condición */}
        {publication.mascota.condicion && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Condición
            </label>
            <div className="relative mt-2 rounded-md bg-gray-100 p-2">
              <span>{publication.mascota.condicion.nombre || 'Desconocido'}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link 
          href="/dashboard/publications" 
          className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Volver a publicaciones
        </Link>
      </div>
    </div>
  );
}