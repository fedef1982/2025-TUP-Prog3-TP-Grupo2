import Breadcrumbs from '@/app/ui/publications/breadcrumbs';
import { Metadata } from 'next';
import { fetchCurrentUserId } from '@/app/lib/data';
import CreatePublicationForm from '@/app/ui/publications/create-form';

export const metadata: Metadata = {
  title: 'Crear publicación',
};

export default async function Page() {
  const userId = await fetchCurrentUserId()|| 2;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Publicaciones', href: '/dashboard/publications' },
          {
            label: 'Crear publicación',
            href: '/dashboard/publications/create',
            active: true,
          },
        ]}
      />
      <CreatePublicationForm userId={userId} />
    </main>
  );
}