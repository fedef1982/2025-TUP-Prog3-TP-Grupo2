import AdoptarLogo from '@/app/ui/adoptar-logo';
import { Suspense } from 'react';
import CreateUserForm from '../ui/users/create-form';

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:max-w-[800px] md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-violet-500 p-3 md:h-36 mb-36">
          <div className="w-32 text-white md:w-36">
            <AdoptarLogo />
          </div>
        </div>
        <div className="mt-8"> 
          <Suspense>
            <CreateUserForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
