import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ViewVisitForm from '@/app/ui/visits/view-form';
import Breadcrumbs from '@/app/ui/visits/breadcrumbs';
import { fetchVisitById } from '@/app/lib/dataVisits';
import { getToken } from '@/app/lib/server-utils';

export const metadata: Metadata = {
  title: 'Ver Visita',
};

export default async function Page({ params }: { params: { id?: string } }) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    console.error('Parametro ID de Visit no definido en la URL');
    notFound();
  }
  
  const token = await getToken();
  const rolId = token?.rol_id ?? 2;
  const userId = token?.sub || 0;

  try {
    const visitId = Math.floor(Number(resolvedParams.id));

    if (!Number.isSafeInteger(visitId) || visitId <= 0) {
      console.error(`ID de Vista invalido: ${resolvedParams.id}`);
      notFound();
    }

    const visit = await fetchVisitById(visitId, userId);

    if (!visit || visit.id !== visitId) {
      console.error(`Visit ID mismatch: Expected ${visitId}, Got ${visit?.id}`);
      notFound();
    }

    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Visitas', href: '/dashboard/visits' },
            {
              label: 'Detalle de Visita',
              href: `/dashboard/visits/${visitId}/view`,
              active: true,
            },
          ]}
        />
        <ViewVisitForm 
          visit={visit} 
          userId={userId}
          rol_id={rolId} 
        />
      </main>
    );

  } catch (error) {
    console.error('Error inesperado en la pagina de visita:', error);
    notFound();
  }
}