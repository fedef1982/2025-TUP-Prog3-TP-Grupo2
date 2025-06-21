import { CheckIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function PublicationStatus({ 
  status, 
  published 
}: { 
  status: string; 
  published: Date | null
}) {
  const isPublished = published !== null && status === 'Activo';
  
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        {
          'bg-green-100 text-green-800': isPublished,
          'bg-gray-100 text-gray-800': !isPublished,
        },
      )}
    >
      {isPublished ? (
        <>
          Publicado
          <EyeIcon className="ml-1 w-4 text-green-800" />
        </>
      ) : (
        <>
          No Publicado
          <EyeSlashIcon className="ml-1 w-4 text-gray-800" />
        </>
      )}
    </span>
  );
}