'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
  PhoneIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { registerUser } from '@/app/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/app/ui/form-field'
import React from 'react';
import { useState } from 'react';

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, formAction] = useActionState(registerUser, null);
  const [isPending, setIsPending] = useState(false);

  // Efecto para redirigir si el registro fue exitoso
  React.useEffect(() => {
    if (state?.success) {
      router.push('/login'); 
    }
  }, [state, router]);


  return (
    <form action={formAction} className="space-y-3">
      {/* Contenedor principal */}
      <div className="flex-1 rounded-lg bg-gray-200 px-6 pb-8 pt-10 w-full max-w-[1000px] min-h-[760px] md:min-h-[760px]">
        {/* Título */}
        <h1 className={`${lusitana.className} mb-8 text-2xl text-center`}>
          Por favor complete los siguientes datos para registro.
        </h1>
        
        {/* Grid responsive: 2 columnas en >560px, 1 columna en <560px */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Columna 1 */}
          <div className="space-y-6">
            <FormField
              id="email"
              name="email"
              type="email"
              placeholder="Ingrese su correo electrónico"
              required
              icon={AtSymbolIcon}
              label="Usuario"
            />
            <FormField
              id="name"
              name="name"
              type="text"
              placeholder="Ingrese su nombre"
              required
              minLength={3}
              pattern="[A-Za-zÁ-ú\s]+"
              icon={UserIcon}
              label="Nombre"
            />
            <FormField
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Ingrese su apellido"
              required
              minLength={3}
              pattern="[A-Za-zÁ-ú\s]+"
              icon={UserIcon}
              label="Apellido"
            />       
          </div>
          {/* Columna 2 */}
          <div className="space-y-6">
            <FormField
              id="address"
              name="address"
              type="text"
              placeholder="Ej: Av. Principal 123"
              icon={MapIcon}
              label="Dirección"
              optional
            />
            <FormField
              id="phone"
              name="phone"
              type="tel"
              placeholder="Ej: +51 987 654 321"
              pattern="[0-9\s+]+"
              icon={PhoneIcon}
              label="Teléfono"
              optional
            />
            <FormField
              id="password"
              name="password"
              type="password"
              placeholder="Ingrese contraseña"
              required
              minLength={6}
              icon={KeyIcon}
              label="Contraseña"
            />  
          </div>
        </div>

        {/* Sección inferior (full width) */}
        <div className="mt-8 col-span-full">
          
          <Button
            type="submit"
            className="w-full py-3 text-lg" 
            disabled={isPending} 
          >
            {isPending ? 'Registrando...' : 'Registrar'} 
            <ArrowRightIcon className="ml-auto h-6 w-6 text-gray-50" />
          </Button>

          <div className="mt-6 flex flex-col items-center space-y-4">
            <Link href="/" className="flex items-center text-violet-600 hover:text-violet-800 text-sm font-medium transition-colors">
              <ArrowRightIcon className="h-5 w-5 rotate-180 mr-2" />
              <span>Volver al inicio</span>
            </Link>

          {state?.message && (
            <div className={`flex items-center mt-4 ${state.success ? 'text-green-600' : 'text-red-500'}`} aria-live="polite">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              <p className="text-sm">{state.message}</p>
            </div>
           )}
          </div>
        </div>
      </div>
    </form>
  );
}