import Breadcrumbs from '@/app/ui/donations/breadcrumbs';
import { Metadata } from 'next';
import CreateDonationForm from '@/app/ui/donations/create-form';

export const metadata: Metadata = {
  title: 'Crear donacion',
};

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Donacions', href: '/dashboard/donations' },
          {
            label: 'Crear donacion',
            href: '/dashboard/donations/create',
            active: true,
          },
        ]}
      />
      <CreateDonationForm />
    </main>
  );
}