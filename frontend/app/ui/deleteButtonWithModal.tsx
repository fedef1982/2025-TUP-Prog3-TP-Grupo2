'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from './confirmModal';
import { toast } from 'sonner';

interface DeleteButtonWithModalProps {
  id: string | number;
  deleteAction: (id: number) => Promise<any> | void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  className?: string;
}

/* export function DeleteButtonWithModal({
  id,
  deleteAction,
  title = '¿Eliminar?',
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  icon,
  className = '',
}: DeleteButtonWithModalProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const deleteWithId = () => deleteAction(Number(id));

  const handleDelete = () => {
    setDeleting(true);
    formRef.current?.requestSubmit();
    setModalOpen(false);
  };

  useEffect(() => {
    if (deleting) {
      router.refresh();
      setDeleting(false);
    }
  }, [deleting, router]);

  return (
    <>
      <button
        type="button"
        className={`rounded-md border p-2 hover:bg-gray-100 ${className}`}
        onClick={() => setModalOpen(true)}
      >
        <span className="sr-only">{confirmText}</span>
        {icon}
      </button>
      <ConfirmModal
        open={modalOpen}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
      />
      <form ref={formRef} action={deleteWithId} style={{ display: 'none' }}>
        <button type="submit"></button>
      </form>
    </>
  );
} */

export function DeleteButtonWithModal({
  id,
  deleteAction,
  title = '¿Eliminar?',
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  icon,
  className = '',
}: DeleteButtonWithModalProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    
    const result = await deleteAction(Number(id));

    if (result && result.ok === false) {
      // 2. Mostrar toast de error con el mensaje del backend
      toast.error(result.message); 
      setLoading(false);
      setModalOpen(false);
    } else {
      // 3. Opcional: Mostrar toast de éxito
      toast.success('Eliminado correctamente');
      setModalOpen(false);
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`rounded-md border p-2 hover:bg-gray-100 ${className}`}
        onClick={() => setModalOpen(true)}
      >
        <span className="sr-only">{confirmText}</span>
        {icon}
      </button>

      {}

      <ConfirmModal
        open={modalOpen}
        title={title}
        message={message}
        confirmText={loading ? "Eliminando..." : confirmText}
        cancelText={cancelText}
        onConfirm={handleDelete}
        onCancel={() => !loading && setModalOpen(false)}
      />
    </>
  );
}