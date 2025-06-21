import { HeartIcon } from '@heroicons/react/24/outline';
import { lusitana, michroma } from '@/app/ui/fonts';
import { PawPrint } from 'lucide-react';

export default function AdoptarLogo() {
  return (
    <div className={`${michroma.className} flex flex-row items-center justify-left w-full`}>
      <p className="text-[5vw] md:text-[44px] mx-4  text-white">AdoptAR</p>
      <PawPrint className="h-[10%] w-[10%] max-h-14 max-w-14 min-h-10 min-w-10 rotate-[-15deg]  text-white" />
    </div>
  );
}