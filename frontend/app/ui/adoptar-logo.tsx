import { HeartIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AdoptarLogo() {
  return (
    <div className={`${lusitana.className} flex items-center gap-1 text-white`}>
      <HeartIcon className="h-8 w-8 rotate-[-15deg] md:h-12 md:w-12" />
      <p className="text-3xl md:text-[44px]">Adoptar</p>
      <HeartIcon className="h-8 w-8 rotate-[15deg] md:h-12 md:w-12" />
    </div>
  );
}
