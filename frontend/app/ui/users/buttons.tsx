'use client';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteUser } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ConfirmModal } from '../confirmModal';
import { DeleteButtonWithModal } from '../deleteButtonWithModal';

export function CreateUser() {
  return (
    <Link
      href="/dashboard/users/create"
      className="flex h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-500  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear usuario</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateUser({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteUser({ id }: { id: string }) {
  return (
    <DeleteButtonWithModal
      id={id}
      deleteAction={deleteUser}
      title="¿Eliminar usuario?"
      message="¿Estás seguro de eliminar este usuario?"
      confirmText="Eliminar"
      cancelText="Cancelar"
      icon={<TrashIcon className="w-5" />}
    />
  );
}