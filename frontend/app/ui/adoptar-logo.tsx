import { HeartIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { PawPrint } from 'lucide-react';

export default function AdoptarLogo() {
  return (
    <div className={`${lusitana.className} flex flex-row items-center justify-center w-full`}>
      <HeartIcon className="h-[10%] w-[10%] max-h-12 max-w-12 min-h-8 min-w-8 rotate-[-15deg]" />
      <p className="text-[5vw] md:text-[44px] mx-2">Adoptar</p>
      <PawPrint className="h-[10%] w-[10%] max-h-12 max-w-12 min-h-8 min-w-8 rotate-[-15deg]" />
    </div>
  );
}