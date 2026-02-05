import Breadcrumbs from '@/app/ui/donations/breadcrumbs';
import { fetchDonationById } from '@/app/lib/dataDonations';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditDonationForm from '@/app/ui/donations/edit-form';
import { EditDonationFormData } from '@/app/lib/definitionsDonations';

export const metadata: Metadata = {
  title: 'Edit donacion',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [user] = await Promise.all([fetchDonationsById(Number(id))]);

  if (!user) {
    notFound();
  }

  const donationForEdit: EditDonationFormData = {
    id: Number(user.id),
    email: user.email,
    nombre: user.nombre,        
    apellido: user.apellido, 
    telefono: user.telefono || "",    
    direccion: user.direccion || "" 
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Donaciones', href: '/dashboard/donations' },
          {
            label: 'Editar donaciones',
            href: `/dashboard/donations/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditDonationForm donation={donationForEdit} />
    </main>
  );
}