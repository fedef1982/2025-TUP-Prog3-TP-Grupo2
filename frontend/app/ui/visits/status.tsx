import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function VisitStatus({ 
  status,
  date
}: { 
  status: string;
  date?: Date
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        {
          'bg-yellow-100 text-yellow-800': status === 'Pendiente',
          'bg-green-100 text-green-800': status === 'Aprobado',
          'bg-red-100 text-red-800': status === 'Rechazado',
        },
      )}
    >
      {status === 'Pendiente' && (
        <>
          Pendiente
          <ClockIcon className="ml-1 w-4 text-yellow-800" />
        </>
      )}
      {status === 'Aprobado' && (
        <>
          Aprobado
          <CheckCircleIcon className="ml-1 w-4 text-green-800" />
        </>
      )}
      {status === 'Rechazado' && (
        <>
          Rechazado
          <XCircleIcon className="ml-1 w-4 text-red-800" />
        </>
      )}
    </span>
  );
}