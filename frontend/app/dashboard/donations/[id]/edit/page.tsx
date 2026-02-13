import Breadcrumbs from '@/app/ui/donations/breadcrumbs';
import { fetchDonationById } from '@/app/lib/dataDonations';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditDonationForm from '@/app/ui/donations/edit-form';

export const metadata: Metadata = {
  title: 'Editar datos de donacion',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;

  if (!id) {
    console.error('Parámetro donationId no definido en la URL');
    notFound();
  }

  try {
    const donationId = Math.floor(Number(id));

    if (!Number.isSafeInteger(donationId) || donationId <= 0) {
      console.error(`ID de datos de donacion inválido: ${id}`);
      notFound();
    }

    const donation = await fetchDonationById(donationId);

    if (!donation || donation.id !== donationId) {
      console.error(`No se pudo obtener la donación con ID: ${donationId}`);
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