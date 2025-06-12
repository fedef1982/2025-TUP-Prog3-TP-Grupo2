import {
  UserIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
//import { fetchUserStats } from '@/app/lib/data';

const iconMap = {
  total: UsersIcon,
  active: CheckCircleIcon,
  pending: ClockIcon,
  admins: ShieldCheckIcon,
  inactive: ExclamationTriangleIcon,
  premium: UserIcon
};

/*export default async function UserCardsWrapper() {
  const stats = await fetchUserStats();
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <UserCard title="Total Users" value={stats.totalUsers} type="total" />
      <UserCard title="Active Users" value={stats.activeUsers} type="active" />
      <UserCard title="Pending Users" value={stats.pendingUsers} type="pending" />
      <UserCard title="Admin Users" value={stats.adminUsers} type="admins" />
      <UserCard title="Inactive Users" value={stats.inactiveUsers} type="inactive" />
    </div>
  );
}*/

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
  const valueColor = type === 'inactive' ? 'text-rose-600' : 
                    type === 'pending' ? 'text-amber-600' : 
                    'text-gray-900';

  return (
    <div className={`rounded-xl bg-gray-50 p-2 shadow-sm ${className}`}>
      <div className="flex items-center p-4">
        {Icon && (
          <Icon className={`h-5 w-5 ${
            type === 'active' ? 'text-green-600' :
            type === 'admins' ? 'text-blue-600' :
            type === 'premium' ? 'text-purple-600' :
            'text-gray-600'
          }`} />
        )}
        <h3 className="ml-2 text-sm font-medium text-gray-900">{title}</h3>
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