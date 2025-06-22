import Pagination from '@/app/ui/publications/pagination';
import Search from '@/app/ui/search';
import PublicationsTable from '@/app/ui/publications/table';
import { CreatePublication } from '@/app/ui/publications/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchPublicationsPages } from '@/app/lib/dataPublications';
import { Metadata } from 'next';
import { PublicationsTableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Publicaciones',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchPublicationsPages(query) || 1;
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Publicaciones</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar publicaciones..." />
        <CreatePublication />
      </div>
      <Suspense key={query + currentPage} fallback={<PublicationsTableSkeleton />}>
        <PublicationsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}