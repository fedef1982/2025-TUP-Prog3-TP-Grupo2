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
import { HeartIcon, PawPrintIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const links = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Usuarios', href: '/dashboard/users', icon: UserGroupIcon },
  { name: 'Mascotas', href: '/dashboard/pets', icon: PawPrintIcon },
  { name: 'Publicaciones', href: '/dashboard/publications', icon: CameraIcon },
  { name: 'Visitas', href: '/dashboard/visits', icon: EyeIcon },
  { name: 'Donaciones', href: '/dashboard/donations', icon: HeartIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = isClient ? pathname === link.href : false;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-200 p-3 text-sm font-medium hover:bg-sky-100 hover:text-violet-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-violet-600': isActive,
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