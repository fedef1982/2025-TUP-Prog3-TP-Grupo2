'use client';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deletePet } from '@/app/lib/actionsPets';
import { useState, useRef, useEffect } from 'react';
import { ConfirmModal } from '../confirmModal';
import { useRouter } from 'next/navigation';
import { DeleteButtonWithModal } from '../deleteButtonWithModal';

export function CreatePet() {
  return (
    <Link
      href="/dashboard/pets/create"
      className="flex h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-500  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear mascota</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewPet({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/pets/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}


export function UpdatePet({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/pets/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeletePet({ id }: { id: string }) {
  return (
    <DeleteButtonWithModal
      id={id}
      deleteAction={deletePet}
      title="¿Eliminar mascota?"
      message="¿Estás seguro de eliminar esta mascota?"
      confirmText="Eliminar"
      cancelText="Cancelar"
      icon={<TrashIcon className="w-5" />}
    />
  );
}