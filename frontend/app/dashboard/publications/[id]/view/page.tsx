import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ViewPublicationForm from '@/app/ui/publications/view-form';
import Breadcrumbs from '@/app/ui/publications/breadcrumbs';
import { fetchPublicationById } from '@/app/lib/dataPublications';
import { getToken } from '@/app/lib/server-utils';

export const metadata: Metadata = {
  title: 'View Publication',
};

export default async function Page({ params }: { params: { id?: string } }) {
  if (!params?.id) {
    console.error('Publication ID parameter not defined in URL');
    notFound();
  }
  
  const tokenPl = await getToken();
  const rolId = tokenPl?.rol_id ?? 2;

  try {
    const publicationId = Math.floor(Number(params.id));

    if (!Number.isSafeInteger(publicationId) || publicationId <= 0) {
      console.error(`Invalid publication ID: ${params.id}`);
      notFound();
    }

    const publication = await fetchPublicationById(publicationId);

    if (!publication || publication.id !== publicationId) {
      console.error(`Publication ID mismatch: Expected ${publicationId}, Got ${publication?.id}`);
      notFound();
    }

    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Publications', href: '/dashboard/publications' },
            {
              label: 'View Publication',
              href: `/dashboard/publications/${publicationId}/view`,
              active: true,
            },
          ]}
        />
        <ViewPublicationForm publication={publication} rol_id={rolId}  />
      </main>
    );

  } catch (error) {
    console.error('Unexpected error in publication view page:', error);
    notFound();
  }
}