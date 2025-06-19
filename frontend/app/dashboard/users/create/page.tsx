import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { Metadata } from 'next';
import CreateUserForm from '@/app/ui/users/create-form';

export const metadata: Metadata = {
  title: 'Crear usuario',
};

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Usuarios', href: '/dashboard/users' },
          {
            label: 'Crear usuario',
            href: '/dashboard/users/create',
            active: true,
          },
        ]}
      />
      <CreateUserForm />
    </main>
  );
}