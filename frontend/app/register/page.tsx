import AdoptarLogo from '@/app/ui/adoptar-logo';
import RegisterForm from '@/app/ui/register-form';
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className={`
        relative mx-auto flex w-full flex-col space-y-4 p-4
        md:max-w-[800px] md:p-6
        max-w-[400px]
        md:-mt-16
      `}>
        {/* Encabezado con logo - Responsive */}
        <div className={`
          flex items-end rounded-lg bg-violet-500 p-3 w-full
          h-20 md:h-36
          h-16
        `}>
          <div className={`
            text-white
            w-32 md:w-40
            w-28
          `}>
            <div className="flex h-20 shrink-0 items-end rounded-lg p-1 md:h-20">
              <AdoptarLogo />
            </div>
          </div>
        </div>        
        <div className={`
          rounded-lg bg-gray-200 p-4
          md:p-4
        `}>
          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}