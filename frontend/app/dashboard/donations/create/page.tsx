import Breadcrumbs from '@/app/ui/pets/breadcrumbs';
import { Metadata } from 'next';
import CreateDonationForm from '@/app/ui/donations/create-form';
import { fetchCurrentUserId } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Crear datos de donacion',
};

export default async function Page() {
  const userId = await fetchCurrentUserId()|| 2;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Datos de donacion', href: '/dashboard/donations' },
          {
            label: 'Crear datos de donacion',
            href: '/dashboard/donations/create',
            active: true,
          },
        ]}
      />
      <CreateDonationForm userId={userId} />
    </main>
  );
}