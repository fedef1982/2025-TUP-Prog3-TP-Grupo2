'use client';

import {
  UserGroupIcon,
  HomeIcon,
  CameraIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { PawPrintIcon } from 'lucide-react';

const links = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Usuarios', href: '/dashboard/users', icon: UserGroupIcon },
  { name: 'Mascotas', href: '/dashboard/pets', icon: PawPrintIcon },
  { name: 'Publicaciones', href: '/dashboard/publications', icon: CameraIcon },
  { name: 'Visitas', href: '/dashboard/visits', icon: EyeIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-200 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
