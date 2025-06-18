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
import { Button } from '@/app/ui/button';
import { useActionState, useEffect } from 'react';
import { updateUser } from '@/app/lib/actions';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { CreateUserState, EditUserFormProps, UpdateUserDto, UpdateUserState } from '@/app/lib/definitions';



export default function EditUserForm({ user }: EditUserFormProps) {
  const [state, formAction] = useActionState<UpdateUserState, FormData>(
    (prevState, formData) => updateUser(user.id, prevState, formData),
    {}
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard'); // Or wherever you want to redirect after update
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-200 p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-2xl`}>
          Editar información de usuario
        </h1>
        
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
            Nombre
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="nombre"
                name="nombre"
                type="text"
                defaultValue={user.nombre}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Apellido */}
        <div className="mb-4">
          <label htmlFor="apellido" className="mb-2 block text-sm font-medium">
            Apellido
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="apellido"
                name="apellido"
                type="text"
                defaultValue={user.apellido}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                defaultValue={user.telefono || ''}
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
                defaultValue={user.direccion || ''}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label htmlFor="contrasenia" className="mb-2 block text-sm font-medium">
            Nueva Contraseña (dejar vacío para no cambiar)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="contrasenia"
                name="contrasenia"
                type="password"
                placeholder="Ingrese nueva contraseña"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <UpdateButton />

        <div className="mt-4 flex justify-center">
          <Link 
            href="/dashboard" 
            className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver al dashboard
          </Link>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state?.Error && (
            <p className="mt-2 flex items-center text-sm text-red-500">
              <ExclamationCircleIcon className="mr-1 h-5 w-5" />
              {state.Error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Actualizando...' : 'Actualizar usuario'}
    </Button>
  );
}