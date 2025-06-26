import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import AdoptarLogo from '@/app/ui/adoptar-logo';
import Search from '../ui/search';
import { Suspense } from 'react';
import { PublicationsTableSkeleton } from '../ui/skeletons';
import Pagination from '../ui/publications/pagination';
import { fetchPublishedPages } from '../lib/dataPublications';
import PublicationsTablePublished from '../ui/publications/tablePublished';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchPublishedPages(query) || 1;
  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-violet-500  p-2 md:h-26">
        <AdoptarLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-between gap-1 rounded-lg bg-gray-200 px-4 py-5 md:w-1/6 md:px-5">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-1xl md:leading-normal`}
          >
            Encontrá tu mascota y solicitá una visita.{' '}
          </p>
          <p
            className={`${lusitana.className} text-l text-gray-800 md:text-1xl md:leading-normal`}>
            Si queres ver el estado de tu visita, hace click en Buscar:
          </p>
          <Link
            href="/tracking"
            className="flex items-center gap-5 self-start rounded-lg bg-violet-500  px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-400 md:text-base"
          >
            <span>Buscar</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <p
            className={`${lusitana.className} text-l text-gray-800 md:text-1xl md:leading-normal`}
          >
            Si queres publicar mascotas en adopción:
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-violet-500  px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-400 md:text-base"
          >
            <span>Ingresar</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              <h1 className={`${lusitana.className} text-2xl`}>Publicaciones</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
              <Search placeholder="Buscar publicaciones..." />
            </div>
            <Suspense key={query + currentPage} fallback={<PublicationsTableSkeleton />}>
              <PublicationsTablePublished query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
      </div>
    </main>
  );
}
