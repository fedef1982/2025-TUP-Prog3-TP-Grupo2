import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    template: '%s | Adoptar',
    default: 'Adoptar',
  },
  description: 'La pagina para encontrar tu proxima mascota',
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        
        {}
        <Toaster 
          richColors 
          position="top-right" 
          closeButton 
          expand={false}
        />
      </body>
    </html>
  );
}