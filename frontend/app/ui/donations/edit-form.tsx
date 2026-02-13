'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  ExclamationCircleIcon,
  UserIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import {
  BuildingIcon,
  CoinsIcon,
  HeartIcon,
  KeyIcon,
  LinkIcon,
  WorkflowIcon,
} from 'lucide-react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { updateDonation } from '@/app/lib/actionsDonations';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { UpdateDonationState, Donation } from '@/app/lib/definitionsDonations';
import { useRouter } from 'next/navigation';

export default function EditDonationForm({
  donation,
  userId,
}: {
  donation: Donation;
  userId: number;
}) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [state, formAction] = useActionState<UpdateDonationState, FormData>(
    (prevState: UpdateDonationState | null, formData: FormData) => 
      updateDonation(donation.id, userId, prevState, formData),
    {
      success: false,
      message: '',
      errors: {}
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (state?.success && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/dashboard/donations');
      router.refresh();
    }
  }, [state, router, isRedirecting]);

  return (
    <form action={formAction} key={String(state?.success)}>
      <input type="hidden" name="userId" value={userId} />
      
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Editar datos de donación
        </h1>

        {/* Destinatario */}
        <div className="mb-4">
          <label htmlFor="destinatario" className="mb-2 block text-sm font-medium">
            Destinatario <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="destinatario"
                name="destinatario"
                type="text"
                placeholder="Nombre del destinatario"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                defaultValue={donation.destinatario}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.destinatario && (
              <p className="mt-2 text-sm text-red-500">{state.errors.destinatario.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Cbu */}
        <div className="mb-4">
          <label htmlFor="cbu" className="mb-2 block text-sm font-medium">
            CBU
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="cbu"
                name="cbu"
                type="text"
                placeholder="Número de CBU (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={donation.cbu || ''}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Cuit */}
        <div className="mb-4">
          <label htmlFor="cuit" className="mb-2 block text-sm font-medium">
            CUIT
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="cuit"
                name="cuit"
                type="text"
                placeholder="Número de CUIT (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={donation.cuit || ''}
              />
              <WorkflowIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Entidad Financiera */}
        <div className="mb-4">
          <label htmlFor="entidad_financiera" className="mb-2 block text-sm font-medium">
            Entidad Financiera <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="entidad_financiera"
                name="entidad_financiera"
                type="text"
                placeholder="Nombre de la entidad financiera"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                defaultValue={donation.entidad_financiera}
              />
              <BuildingIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.entidad_financiera && (
              <p className="mt-2 text-sm text-red-500">{state.errors.entidad_financiera.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Tipo de cuenta */}
        <div className="mb-4">
          <label htmlFor="tipo_cuenta" className="mb-2 block text-sm font-medium">
            Tipo de Cuenta
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="tipo_cuenta"
                name="tipo_cuenta"
                type="text"
                placeholder="Tipo de cuenta CC/CA (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={donation.tipo_cuenta || ''}
              />
              <CoinsIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Alias */}
        <div className="mb-4">
          <label htmlFor="alias" className="mb-2 block text-sm font-medium">
            Alias <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="alias"
                name="alias"
                type="text"
                placeholder="Alias para transferencia"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                defaultValue={donation.alias}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.alias && (
              <p className="mt-2 text-sm text-red-500">{state.errors.alias.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Link de Pago */}
        <div className="mb-4">
          <label htmlFor="link_pago" className="mb-2 block text-sm font-medium">
            Link de Pago
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="link_pago"
                name="link_pago"
                type="text"
                placeholder="Link de pago (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={donation.link_pago || ''}
              />
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Motivo de donacion */}
        <div className="mb-4">
          <label htmlFor="motivo_donacion" className="mb-2 block text-sm font-medium">
            Motivo de donación
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="motivo_donacion"
                name="motivo_donacion"
                type="text"
                placeholder="Para qué se utilizaría la donación (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={donation.motivo_donacion || ''}
              />
              <HeartIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <UpdateDonationButton />

        <div className="mt-4 flex justify-center">
          <Link
            href="/dashboard/donations"
            className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver a donaciones
          </Link>
        </div>

        {state?.message && !state.success && (
          <p className="mt-2 flex items-center text-sm text-red-500">
            <ExclamationCircleIcon className="mr-1 h-5 w-5" />
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function UpdateDonationButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Actualizando...' : 'Actualizar datos de donación'}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}