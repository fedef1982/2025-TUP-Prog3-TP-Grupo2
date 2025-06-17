import {
  CameraIcon,
  EyeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchUserStats } from '@/app/lib/data';
import { PawPrint } from 'lucide-react';

const iconMap = {
  totalusers: UsersIcon,
  totalpets: PawPrint,
  totalpublications: CameraIcon,
  totalvisits: EyeIcon,
};

export default async function UserCardsWrapper() {
  const stats = await fetchUserStats();
  
  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
      <UserCard title="Usuarios" value={stats.totalUsers} type="totalusers" />
      <UserCard title="Mascotas" value={stats.totalPets} type="totalpets" />
      <UserCard title="Publicaciones" value={stats.totalPublications} type="totalpublications" />
      <UserCard title="Visitas" value={stats.totalVisits} type="totalvisits" />
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
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl font-semibold`}
      >
        {value}
      </p>
    </div>
  );
}