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
import { CreateUserState } from '../lib/definitions';

export default function RegisterForm() {
  const [state, formAction] = useActionState<CreateUserState, FormData>(createUser, {});
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/login');
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-200 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Por favor regístrese para continuar.
        </h1>
        <div className="w-full space-y-4">
          {/* Nombre */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="nombre"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Ingrese su nombre"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Apellido */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="apellido"
            >
              Apellido <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="apellido"
                type="text"
                name="apellido"
                placeholder="Ingrese su apellido"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Ingrese su dirección de email"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Teléfono (opcional) */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="telefono"
            >
              Teléfono
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="telefono"
                type="tel"
                name="telefono"
                placeholder="Ingrese su teléfono (opcional)"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Dirección (opcional) */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="direccion"
            >
              Dirección
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="direccion"
                type="text"
                name="direccion"
                placeholder="Ingrese su dirección (opcional)"
              />
              <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="contrasenia"
            >
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="contrasenia"
                type="password"
                name="contrasenia"
                placeholder="Ingrese su contraseña"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${state?.passwordMatchError ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirme su contraseña"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.passwordMatchError && (
              <p className="mt-1 text-sm text-red-500">{state.passwordMatchError}</p>
            )}
          </div>
        </div>

        <RegisterButton />

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-violet-600 hover:text-violet-800 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center space-y-4">
          <Link href="/" className="flex items-center text-violet-600 hover:text-violet-800 text-sm font-medium transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span>Volver al inicio</span>
          </Link>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state?.message && !state.success && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message}</p>
            </>
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