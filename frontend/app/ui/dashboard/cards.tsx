import {
  CameraIcon,
  EyeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchUserStats } from '@/app/lib/data';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  totalusers: UsersIcon,
  totalpets: PawPrint,
  totalpublications: CameraIcon,
  totalvisits: EyeIcon,
};

export default async function UserCardsWrapper() {
  const stats = await fetchUserStats();
  
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full col-span-full">
      <Link href="/dashboard/users" className="block w-full transition-transform hover:scale-105">
        <UserCard title="Usuarios" value={stats.totalUsers} type="totalusers" />
      </Link>
      <Link href="/dashboard/pets" className="block w-full transition-transform hover:scale-105">
        <UserCard title="Mascotas" value={stats.totalPets} type="totalpets" />
      </Link>
      <Link href="/dashboard/publications" className="block w-full transition-transform hover:scale-105">
        <UserCard title="Publicaciones" value={stats.totalPublications} type="totalpublications" />
      </Link>
      <Link href="/dashboard/visits" className="block w-full transition-transform hover:scale-105">
        <UserCard title="Visitas" value={stats.totalVisits} type="totalvisits" />
      </Link>
    </div>
  );
}

interface UserCardProps {
  title: string;
  value: number | string;
  type: keyof typeof iconMap;
  className?: string;
}

export function UserCard({ 
  title, 
  value, 
  type,
  className = '' 
}: UserCardProps) {
  const Icon = iconMap[type];
  const valueColor = 'text-gray-900';

  return (
    <div className={`rounded-xl bg-gray-200 p-2 shadow-sm ${className}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {Icon && (
            <Icon className={`h-5 w-5 ${'text-gray-600'}`} />
          )}
          <h3 className="ml-2 text-sm font-medium text-gray-900 whitespace-nowrap">{title}</h3>
        </div>
      </div>
      <p
        className={`${lusitana.className} ${valueColor}
           rounded-xl bg-white px-4 py-8 text-center text-3xl font-semibold`}
      >
            {value}   
      </p>
    </div>
  );
}