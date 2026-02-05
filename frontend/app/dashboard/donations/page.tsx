import Pagination from '@/app/ui/donations/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/donations/table';
import { CreateDonation } from '@/app/ui/donations/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchDonationsPages } from '@/app/lib/datadonations';
import { Metadata } from 'next';
import { DonationsTableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'users',
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

  const totalPages = await fetchDonationsPages(query) || 1;
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Donaciones</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar donaciones..." />
    {/*    <CreateDonaciones /> */}
      </div> 
      <Suspense key={query + currentPage} fallback={<DonationsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> 
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
