'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
  PhoneIcon,
  HomeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect } from 'react';
import { createUser } from '@/app/lib/actions';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { CreateUserState } from '@/app/lib/definitions';

export default function CreateUserForm() {
  const [state, formAction] = useActionState<CreateUserState, FormData>(createUser, {});
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/login');
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Por favor regístrese para continuar
        </h1>
        
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
            Nombre <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ingrese su nombre"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Apellido */}
        <div className="mb-4">
          <label htmlFor="apellido" className="mb-2 block text-sm font-medium">
            Apellido <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Ingrese su apellido"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Ingrese su dirección de email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Teléfono */}
        <div className="mb-4">
          <label htmlFor="telefono" className="mb-2 block text-sm font-medium">
            Teléfono
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="Ingrese su teléfono (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="mb-4">
          <label htmlFor="direccion" className="mb-2 block text-sm font-medium">
            Dirección
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="direccion"
                name="direccion"
                type="text"
                placeholder="Ingrese su dirección (opcional)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label htmlFor="contrasenia" className="mb-2 block text-sm font-medium">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="contrasenia"
                name="contrasenia"
                type="password"
                placeholder="Ingrese su contraseña"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
            Confirmar Contraseña <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirme su contraseña"
                className={`peer block w-full rounded-md border ${state?.passwordMatchError ? 'border-red-500' : 'border-gray-200'} py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.passwordMatchError && (
              <p className="mt-2 text-sm text-red-500">{state.passwordMatchError}</p>
            )}
          </div>
        </div>

        <RegisterButton />

        <div className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-violet-600 hover:text-violet-800">
            Inicia sesión
          </Link>
        </div>

        <div className="mt-4 flex justify-center">
          <Link 
            href="/" 
            className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver al inicio
          </Link>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state?.message && !state.success && (
            <p className="mt-2 flex items-center text-sm text-red-500">
              <ExclamationCircleIcon className="mr-1 h-5 w-5" />
              {state.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full"
      aria-disabled={pending}
      disabled={pending}
    >
      Registrarse <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}