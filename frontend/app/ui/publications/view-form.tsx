'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  MapPinIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { PublicationWithPet } from '@/app/lib/definitionsPublications';

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
          Status: <span className="font-medium">{publication.estado}</span>
          {publication.publicado && (
            <span className="ml-4">• Published</span>
          )}
        </div>
      </div>

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

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Informacion de la mascota
        </label>
        <div className="rounded-md bg-gray-100 p-3">
          {publication.mascota && (
            <div>
              <p><span className="font-medium">Nombre:</span> {publication.mascota.nombre}</p>
              <p><span className="font-medium">Especie:</span> {publication.mascota.especie?.nombre}</p>
              <p><span className="font-medium">Raza:</span> {publication.mascota.raza}</p>
              <p><span className="font-medium">Edad:</span> {publication.mascota.edad} años</p>
            </div>
          )}
        </div>
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