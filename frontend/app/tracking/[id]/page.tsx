import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import AdoptarLogo from '@/app/ui/adoptar-logo';
import { fetchPublishedPages } from '../../lib/dataPublications';
import { ArrowLeftIcon } from 'lucide-react';
import SearchTrackingForm from '../../ui/visits/tracking-form';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const trackingId = params.id;

  if (!trackingId) {
    notFound();
  }

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
            Verifica el estado de tu visita.{' '}
          </p>
          <p
            className={`${lusitana.className} text-l text-gray-800 md:text-1xl md:leading-normal`}
          >
            Si queres volver a las publicaciones:
          </p>
          <Link
            href="/published"
            className="flex items-center gap-5 self-start rounded-lg bg-violet-500  px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-400 md:text-base"
          >
            <ArrowLeftIcon className="w-5 md:w-6" /> <span>Volver</span> 
          </Link>
        </div>
        <div className="flex flex-col w-full items-center">
          <h1 className={`${lusitana.className} mb-3 text-2xl w-full text-center`}>
            Conserve el siguiente ID de tracking para seguimiento:
          </h1>

          <h1 className={`${lusitana.className} mb-6 text-3xl w-full text-center font-bold`}>
            {trackingId}
          </h1>
          
          <div className="w-full">
            <SearchTrackingForm/> 
          </div>
        </div>
      </div>
    </main>
  );
}
