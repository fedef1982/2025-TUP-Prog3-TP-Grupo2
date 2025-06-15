import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create user',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'users', href: '/dashboard/users' },
          {
            label: 'Create user',
            href: '/dashboard/users/create',
            active: true,
          },
        ]}
      />
    </main>
  );
}
