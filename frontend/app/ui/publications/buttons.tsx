'use client';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deletePublication, publishPublication } from '@/app/lib/actionsPublications';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ConfirmModal } from '../confirmModal';
import { DeleteButtonWithModal } from '../deleteButtonWithModal';


export function CreatePublication() {
  return (
    <Link
      href="/dashboard/publications/create"
      className="flex h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear publicación</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewPublication({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/publications/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function UpdatePublication({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/publications/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeletePublication({ id }: { id: string }) {
  return (
    <DeleteButtonWithModal
      id={id}
      deleteAction={deletePublication}
      title="¿Eliminar publicación?"
      message="¿Estás seguro de eliminar esta publicación?"
      confirmText="Eliminar"
      cancelText="Cancelar"
      icon={<TrashIcon className="w-5" />}
    />
  );
}
/*
export function DeletePublication({ id }: { id: string }) {
  const deletePublicationWithId = deletePublication.bind(null, Number(id));

  return (
    <form action={deletePublicationWithId}>
      <button 
        type="submit" 
        className="rounded-md border p-2 hover:bg-gray-100"
        aria-label="Eliminar publicación"
      >
        <span className="sr-only">Eliminar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
*/

/*
export function PublishPublication({ 
  id, 
  userId 
}: { 
  id: string, 
  userId: string 
}) {
  const publishPublicationWithId = publishPublication.bind(
    null, 
    Number(id), 
    Number(userId)
  );

  return (
    <form action={publishPublicationWithId}>
      <button 
        type="submit" 
        className="rounded-md border p-2 hover:bg-green-100 text-green-600"
        aria-label="Publish publication"
      >
        <span className="sr-only">Publicar</span>
        <ArrowUpOnSquareIcon className="w-5" />
      </button>
    </form>
  );
}*/