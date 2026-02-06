import Breadcrumbs from '@/app/ui/pets/breadcrumbs';
import { fetchDonationById } from '@/app/lib/dataDonations';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditDonationForm from '@/app/ui/donations/edit-form';

export const metadata: Metadata = {
  title: 'Editar datos de donacion',
};

export default async function Page({ params }: { params: { id?: string } }) {

  if (!params?.id) {
    console.error('Parámetro donationId no definido en la URL');
    notFound();
  }

  try {

    const donationId = Math.floor(Number(params.id));

    if (!Number.isSafeInteger(donationId) || donationId <= 0) {
      console.error(`ID de datos de donacion inválido: ${params.id}`);
      notFound();
    }

    const data = await Promise.allSettled(
      [fetchDonationById(donationId)]
    );

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
            { label: 'Datos de donacion', href: '/dashboard/donations' },
            {
              label: 'Editar datos de donacion',
              href: `/dashboard/donations/${donationId}/edit`,
              active: true,
            },
          ]}
        />
        <EditDonationForm 
          donation={donation} 
          userId={donation.usuario_id}
        />
      </main>
    );

  } catch (error) {
    console.error('Error inesperado en la página:', error);
    notFound();
  }
}