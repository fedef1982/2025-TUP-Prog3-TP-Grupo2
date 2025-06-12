import { redirect } from 'next/navigation';
import SideNav from '@/app/ui/dashboard/sidenav';
import { getToken } from '../lib/server-utils';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const token = await getToken(); // Verifica la cookie/headers
  if (!token) redirect('/login'); // Si no hay token, redirige

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}