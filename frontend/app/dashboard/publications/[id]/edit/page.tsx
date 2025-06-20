import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchUserById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditUserForm from '@/app/ui/users/edit-form';
import { EditUserFormData } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Edit user',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [user] = await Promise.all([fetchUserById(Number(id))]);

  if (!user) {
    notFound();
  }

  const userForEdit: EditUserFormData = {
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
          { label: 'Usuarios', href: '/dashboard/users' },
          {
            label: 'Esditar usuario',
            href: `/dashboard/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditUserForm user={userForEdit} />
    </main>
  );
}