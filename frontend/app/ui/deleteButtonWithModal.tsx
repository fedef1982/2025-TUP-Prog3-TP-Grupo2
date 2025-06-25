'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from './confirmModal';

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
}
