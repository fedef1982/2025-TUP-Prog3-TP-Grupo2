import Breadcrumbs from '@/app/ui/pets/breadcrumbs';
import { fetchPublicationById } from '@/app/lib/dataPublications';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditPublicationForm from '@/app/ui/publications/edit-form';
import { fetchUserPets } from '@/app/lib/dataPets';

export const metadata: Metadata = {
  title: 'Editar publicación',
};

export default async function Page({ params }: { params: { id?: string } }) {
  if (!params?.id) {
    console.error('Parámetro publicationId no definido en la URL');
    notFound();
  }

  try {
    const publicationId = Math.floor(Number(params.id));

    if (!Number.isSafeInteger(publicationId) || publicationId <= 0) {
      console.error(`ID de publicación inválido: ${params.id}`);
      notFound();
    }

    // Obtener la publicación y las mascotas del usuario en paralelo
    const [publicationResult, petsResult] = await Promise.allSettled([
      fetchPublicationById(publicationId),
      fetchUserPets() // Asumo que tienes o crearás esta función
    ]);

    if (publicationResult.status === 'rejected' || !publicationResult.value) {
      console.error('Error al obtener publicación:', publicationResult.status === 'rejected' ? publicationResult.reason : 'Datos vacíos');
      notFound();
    }

    const publication = publicationResult.value;

    if (!publication || publication.id !== publicationId) {
      console.error(`Mismatch en ID de publicación: Esperado ${publicationId}, Obtenido ${publication?.id}`);
      notFound();
    }

    const pets = petsResult.status === 'fulfilled' ? petsResult.value : [];

    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Publicaciones', href: '/dashboard/publications' },
            {
              label: 'Editar publicación',
              href: `/dashboard/publications/${publicationId}/edit`,
              active: true,
            },
          ]}
        />
        <EditPublicationForm 
          publication={publication} 
          userId={publication.mascota.usuario_id}
          pets={pets}
        />
      </main>
    );

  } catch (error) {
    console.error('Error inesperado en la página:', error);
    notFound();
  }
}