import Breadcrumbs from '@/app/ui/pets/breadcrumbs';
import { fetchPetById, fetchAllSpecies, fetchAllConditions } from '@/app/lib/dataPets';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditPetForm from '@/app/ui/pets/edit-form';

export const metadata: Metadata = {
  title: 'Editar mascota',
};

export default async function Page({ params }: { params: { id?: string } }) {

  if (!params?.id) {
    console.error('Parámetro petId no definido en la URL');
    notFound();
  }

  try {

    const petId = Math.floor(Number(params.id));

    if (!Number.isSafeInteger(petId) || petId <= 0) {
      console.error(`ID de mascota inválido: ${params.id}`);
      notFound();
    }

    const data = await Promise.allSettled([
      fetchPetById(petId),
      fetchAllSpecies(),
      fetchAllConditions()
    ]);

    const [petResult, speciesResult, conditionsResult] = data;

    if (petResult.status === 'rejected' || !petResult.value) {
      console.error('Error al obtener mascota:', petResult.status === 'rejected' ? petResult.reason : 'Datos vacíos');
      notFound();
    }

    const pet = petResult.value;

    if (!pet || pet.id !== petId) {
      console.error(`Mismatch en ID de mascota: Esperado ${petId}, Obtenido ${pet?.id}`);
      notFound();
    }

    const species = speciesResult.status === 'fulfilled' ? speciesResult.value : [];
    const conditions = conditionsResult.status === 'fulfilled' ? conditionsResult.value : [];

    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Mascotas', href: '/dashboard/pets' },
            {
              label: 'Editar mascota',
              href: `/dashboard/pets/${petId}/edit`,
              active: true,
            },
          ]}
        />
        <EditPetForm 
          pet={pet} 
          userId={pet.usuario_id}
          species={species}
          conditions={conditions}
        />
      </main>
    );

  } catch (error) {
    console.error('Error inesperado en la página:', error);
    notFound();
  }
}