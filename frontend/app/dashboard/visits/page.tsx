import Pagination from '@/app/ui/visits/pagination';
import Search from '@/app/ui/search';
import VisitsTable from '@/app/ui/visits/table';
import { CreateVisit } from '@/app/ui/visits/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchVisitsPages } from '@/app/lib/dataVisits';
import { Metadata } from 'next';
import { VisitsTableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Visitas',
};

export default async function Page({
  searchParams,
  params
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
  params: { userId: string };
}) {
  const query = await searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const userId = Number(params.userId);

  const totalPages = await fetchVisitsPages(query) || 1;
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Gestión de Visitas</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar por nombre, email o tracking..." />
      </div>
      <Suspense key={query + currentPage} fallback={<VisitsTableSkeleton />}>
        <VisitsTable 
          query={query} 
          currentPage={currentPage} 
          userId={userId} 
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} />
        )}
      </div>
    </div>
  );
}