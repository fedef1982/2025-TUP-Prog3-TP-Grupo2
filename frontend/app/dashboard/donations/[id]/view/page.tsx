import Breadcrumbs from '@/app/ui/pets/breadcrumbs';
import { fetchDonationById } from '@/app/lib/dataDonations';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReadOnlyDonationForm from '@/app/ui/donations/view-form';

export const metadata: Metadata = {
  title: 'Ver donacion',
};

export default async function Page({ params }: { params: { id?: string } }) {
  const resolvedParams = params;
  if (!resolvedParams?.id) {
    console.error('Parámetro donationId no definido en la URL');
    notFound();
  }

  try {
    const donationId = Math.floor(Number(resolvedParams.id));

    if (!Number.isSafeInteger(donationId) || donationId <= 0) {
      console.error(`ID de donacion inválido: ${resolvedParams.id}`);
      notFound();
    }

    const data = await Promise.allSettled([
      fetchDonationById(donationId),
    ]);

    console.log("fetchDonationById respuesta",data);

    const [donationResult] = data;

    if (donationResult.status === 'rejected' || !donationResult.value) {
      console.error('Error al obtener datos de donacion:', donationResult.status === 'rejected' ? donationResult.reason : 'Datos vacíos');
      notFound();
    }

    const donation = donationResult.value;

    if (!donation || donation.id !== donationId) {
      console.error(`Mismatch en ID de datos de donacion: Esperado ${donationId}, Obtenido ${donation?.id}`);
      notFound();
    }

    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Donaciones', href: '/dashboard/donations' },
            {
              label: 'Ver datos de donacion',
              href: `/dashboard/donations/${donationId}/view`,
              active: true,
            },
          ]}
        />
        <ReadOnlyDonationForm 
          donation={donation}
        />
      </main>
    );

  } catch (error) {
    console.error('Error inesperado en la página:', error);
    notFound();
  }
}