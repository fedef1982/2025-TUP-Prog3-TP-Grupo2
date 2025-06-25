import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import AdoptarLogo from '@/app/ui/adoptar-logo';
import { fetchPublishedById } from '../../../lib/dataPublications';
import ViewPublishedForm from '@/app/ui/publications/view-form-publica';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id?: string } }) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    console.error('Publication ID parameter not defined in URL');
    notFound();
  }

  try {
    const publicationId = Math.floor(Number(resolvedParams.id));

    if (!Number.isSafeInteger(publicationId) || publicationId <= 0) {
      console.error(`Invalid publication ID: ${resolvedParams.id}`);
      notFound();
    }

    const publication = await fetchPublishedById(publicationId); 

    if (!publication || publication.id !== publicationId) {
      console.error(`Publication ID mismatch: Expected ${publicationId}, Got ${publication?.id}`);
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
            Encontrá tu mascota y coordiná una visita.{' '}
          </p>
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
          <ViewPublishedForm publication={publication}/>
          </div>
      </div>
    </main>
  );
  } catch (error) {
    console.error('Unexpected error in publication view page:', error);
    notFound();
  }
}
