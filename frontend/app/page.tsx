import AdoptarLogo from '@/app/ui/adoptar-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-violet-500 p-4 md:h-24">
        <AdoptarLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-3 rounded-lg bg-gray-200 px-4 py-4 md:w-3/5 md:px-10">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-snug`}
          >
            <strong>Bienvenido a Adoptar</strong> el sitio para encontrar tu próxima mascotas{' '}
          </p>
          <Link
            href="/publicaciones"
            className="flex items-center gap-5 self-start rounded-lg bg-violet-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Ver Publicaicones</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-2xl md:leading-normal`}
          >
            Si queres publicar mascotas en adopción:
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-violet-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Ingresar</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/adoptar-desktop.jpg"
            width={1000}
            height={760}
            alt="Screenshots of the dashboard project showing desktop version"
            className="hidden md:block"
          />
          <Image
            src="/adoptar-mobile.jpg"
            width={560}
            height={620}
            alt="Screenshot of the dashboard project showing mobile version"
            className="block md:hidden"
          />
        </div>
      </div>
    </main>
  );
}
