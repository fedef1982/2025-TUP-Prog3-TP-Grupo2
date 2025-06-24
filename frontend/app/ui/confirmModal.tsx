'use client';

import React from 'react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title = 'Confirmar acción',
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm sm:max-w-md sm:p-7">
        {title && <h2 className="text-lg sm:text-xl font-semibold mb-2">{title}</h2>}
        <p className="mb-4 text-gray-700 text-sm sm:text-base">{message}</p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}