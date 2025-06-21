import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deletePet } from '@/app/lib/actionsPets';

export function CreatePet() {
  return (
    <Link
      href="/dashboard/pets/create"
      className="flex h-10 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-500  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear mascota</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewPet({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/pets/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}


export function UpdatePet({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/pets/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeletePet({ id }: { id: string }) {
  const deletePetWithId = deletePet.bind(null, Number(id));

  return (
    <form action={deletePetWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

/*
export function DeletePet({ id }: { id: string }) {
  const deletePetWithId = deletePet.bind(null, Number(id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta mascota?");
    if (confirmed) {
      deletePetWithId();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
*/