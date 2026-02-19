'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  UserIcon,
  CakeIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  LinkIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import {  
  BuildingIcon,
  CoinsIcon,
  MarsIcon,
  VenusIcon,
  WorkflowIcon, 
} from 'lucide-react';
import Link from 'next/link';
import { Donation } from '@/app/lib/definitionsDonations';

export default function ReadOnlyDonationForm({ 
  donation, 
}: { 
  donation: Donation;
}) {
  return (
    <div className="rounded-md bg-gray-200 p-4 md:p-6">
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        Información los datos de donacion
      </h1>

      {/* Destinatario */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Destinatario
        </label>
        <div className="relative mt-2 rounded-md bg-gray-100 p-2">
          <div className="flex items-center">
            <UserIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
            <span>{donation.destinatario}</span>
          </div>
        </div>
      </div>

      {/* cbu */}
      {donation.cbu && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            CBU
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <KeyIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{donation.cbu}</span>
            </div>
          </div>
        </div>
      )}

      {/* cuit */}
      {donation.cuit && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            CUIT
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <WorkflowIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{donation.cuit}</span>
            </div>
          </div>
        </div>
      )}

      {/* entidad financiera */}
      {donation.entidad_financiera && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Entidad Financiera
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <BuildingIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{donation.entidad_financiera}</span>
            </div>
          </div>
        </div>
      )}BuildingIcon

      {/* tipo de cuenta */}
      {donation.tipo_cuenta && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Tipo de cuenta
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <CoinsIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{donation.tipo_cuenta}</span>
            </div>
          </div>
        </div>
      )}

      {/* alias */}
      {donation.alias && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Alias
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <UserIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{donation.alias}</span>
            </div>
          </div>
        </div>
      )}

      {/* link de pago */}
      {donation.link_pago && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Link de pago
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <LinkIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{donation.link_pago}</span>
            </div>
          </div>
        </div>
      )}

      {/* Motivo de donacion */}
      {donation.motivo_donacion && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Motivo de donacion
          </label>
          <div className="relative mt-2 rounded-md bg-gray-100 p-2">
            <div className="flex items-center">
              <InformationCircleIcon className="mr-2 h-[18px] w-[18px] text-gray-500" />
              <span>{donation.motivo_donacion}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Link 
          href="/dashboard/donations" 
          className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Volver a datos de donacion
        </Link>
      </div>
    </div>
  );
}