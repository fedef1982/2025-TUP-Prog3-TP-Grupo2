import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import AdoptarLogo from '@/app/ui/adoptar-logo';
import { lusitana } from '@/app/ui/fonts';
 
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-violet-500 p-2 md:h-26">
        <AdoptarLogo />
      </div>
      
      <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <FaceFrownIcon className="w-16 h-16 text-gray-400" />
          <h2 className={`${lusitana.className} text-2xl font-semibold text-gray-800`}>
            Donación no encontrada
          </h2>
          <p className="text-gray-600 max-w-md">
            No pudimos encontrar la información de donación que estás buscando. 
            Es posible que el ID proporcionado sea incorrecto o que la donación haya sido eliminada.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link
            href="/published"
            className="rounded-lg bg-violet-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-400"
          >
            Volver a la Publicaciones
          </Link>
        </div>
      </div>
    </main>
  );
}