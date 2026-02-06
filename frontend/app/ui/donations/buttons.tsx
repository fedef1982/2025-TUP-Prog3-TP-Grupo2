'use client';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteDonation } from '@/app/lib/actionsDonations';
import { useState, useRef, useEffect } from 'react';
import { ConfirmModal } from '../confirmModal';
import { useRouter } from 'next/navigation';
import { DeleteButtonWithModal } from '../deleteButtonWithModal';

export function CreateDonation() {
  return (
    <Link
      href="/dashboard/donations/create"
      className="flex h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-500  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear datos donacion</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewDonation({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/donations/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}


export function UpdateDonation({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/donations/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteDonation({ id }: { id: string }) {
  return (
    <DeleteButtonWithModal
      id={id}
      deleteAction={deleteDonation}
      title="¿Eliminar datos de donacion?"
      message="¿Estás seguro de eliminar estos datos de donacion?"
      confirmText="Eliminar"
      cancelText="Cancelar"
      icon={<TrashIcon className="w-5" />}
    />
  );
}