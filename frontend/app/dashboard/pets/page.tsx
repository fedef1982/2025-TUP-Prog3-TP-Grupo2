import Pagination from '@/app/ui/pets/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/pets/table';
import { CreatePet } from '@/app/ui/pets/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchPetsPages } from '@/app/lib/dataPets';
import { Metadata } from 'next';
import { PetsTableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'pets',
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

  const totalPages = await fetchPetsPages(query) || 1;
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Mascotas</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar mascotas..." />
        <CreatePet />
      </div>
      <Suspense key={query + currentPage} fallback={<PetsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> 
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
