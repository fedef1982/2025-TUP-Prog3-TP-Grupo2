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
    
    try {
      const result = await deleteAction(Number(id));
      
      if (result && result.ok === false) {
        toast.error(result.message); 
        setLoading(false);
        setModalOpen(false);
      } else {
        toast.success('Eliminado correctamente');
        setModalOpen(false);
        
        // Cierra el modal primero
        setModalOpen(false);
        
        // Si el usuario eliminado es el actual, redirigir al login
        if (result.shouldRedirect) {
          // Eliminar la cookie de token
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure';
          
          // Redirigir al login
          router.push('/login');
        } else {
          // Solo hacer refresh si no es el usuario actual
          router.refresh();
        }
        
        // Pequeño delay para asegurar que el refresh no cause problemas
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    } catch (error) {
      toast.error('Error al eliminar');
      setLoading(false);
      setModalOpen(false);
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