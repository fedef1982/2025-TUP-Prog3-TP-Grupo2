import Breadcrumbs from '@/app/ui/pets/breadcrumbs';
import { Metadata } from 'next';
import CreatePetForm from '@/app/ui/pets/create-form';
import { getToken } from '@/app/lib/server-utils';
import { fetchCurrentUserId } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Crear mascota',
};

export default async function Page() {
  const userId = await fetchCurrentUserId()|| 1;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Mascotas', href: '/dashboard/pets/create' },
          {
            label: 'Crear mascota',
            href: '/dashboard/pets/create',
            active: true,
          },
        ]}
      />
      <CreatePetForm userId={userId} />
    </main>
  );
}