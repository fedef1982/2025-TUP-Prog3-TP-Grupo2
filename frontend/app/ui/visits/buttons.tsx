'use client';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon, CheckIcon, XMarkIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteVisit, approveVisit, rejectVisit } from '@/app/lib/actionsVisits';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ConfirmModal } from '../confirmModal';
import { DeleteButtonWithModal } from '../deleteButtonWithModal';

export function CreateVisit({ publicationId }: { publicationId: string }) {
  return (
    <Link
      href={`/publications/${publicationId}/visits/create`}
      className="flex h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Solicitar visita</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewVisit({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/visits/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function DeleteVisit({ id, userId }: { id: string; userId: string }) {
  return (
    <DeleteButtonWithModal
      id={id}
      deleteAction={deleteVisit}
      title="¿Eliminar visita?"
      message="¿Estás seguro de eliminar esta solicitud de visita?"
      confirmText="Eliminar"
      cancelText="Cancelar"
      icon={<TrashIcon className="w-5" />}
    />
  );
}

export function ApproveVisit({ id, userId }: { id: string; userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    const shouldApprove = window.confirm('¿Estás seguro de aprobar esta solicitud de visita?');
    if (!shouldApprove) return;

    setIsLoading(true);
    try {
      await approveVisit(Number(id), Number(userId));
      router.refresh();
    } catch (error) {
      alert('Error al aprobar la visita');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleApprove}
      className="rounded-md border p-2 text-green-600 hover:bg-green-50"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24"></svg>
          Procesando...
        </span>
      ) : (
        <CheckIcon className="w-5" />
      )}
    </button>
  );
}

export function RejectVisit({ id, userId }: { id: string; userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReject = async () => {
    const shouldReject = window.confirm('¿Estás seguro de rechazar esta solicitud de visita?');
    if (!shouldReject) return;

    setIsLoading(true);
    try {
      await rejectVisit(Number(id), Number(userId));
      router.refresh();
    } catch (error) {
      alert('Error al rechazar la visita');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleReject}
      className="rounded-md border p-2 text-red-600 hover:bg-red-50"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24"></svg>
          Procesando...
        </span>
      ) : (
        <XMarkIcon className="w-5" />
      )}
    </button>
  );
}


export function TrackVisit({ trackingId }: { trackingId: string }) {
  return (
    <Link
      href={`/visits/tracking/${trackingId}`}
      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
    >
      <span className="hidden md:block">Ver estado</span>
      <ArrowUpOnSquareIcon className="h-5 md:ml-4" />
    </Link>
  );
}