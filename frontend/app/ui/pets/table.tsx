import { UpdatePet, DeletePet, ViewPet } from '@/app/ui/pets/buttons';
import { fetchFilteredPets, formatPetsForTable } from '@/app/lib/dataPets';

export default async function PetsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const pets = await fetchFilteredPets({
    query,
    page: currentPage
  });
  const formattedPets = formatPetsForTable(pets.pets);

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-200 p-2 md:pt-0">
          <div className="md:hidden">
            {formattedPets?.map((pet) => (
              <div
                key={pet.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="font-medium">{pet.nombre}</p>
                    </div>
                    <p className="text-sm text-gray-500">Especie: {pet.especie}</p>
                    {pet.raza && <p className="text-sm text-gray-500">Raza: {pet.raza}</p>}
                    <p className="text-sm text-gray-500">Condición: {pet.condicion}</p>
                    <p className="text-sm text-gray-500">Tamaño: {pet.tamanio}</p>
                    <p className="text-sm text-gray-500">Sexo: {pet.sexo}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm">Fecha creación: {formatDate(pet.createdAt)}</p>
                  </div> 
                  <div className="flex justify-end gap-2">
                    <ViewPet id={pet.id} />
                    <UpdatePet id={pet.id} />
                    <DeletePet id={pet.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nombre
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Especie
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Raza
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Condición
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tamaño
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Sexo
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha Creación
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {formattedPets?.map((pet) => (
                <tr
                  key={pet.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{pet.nombre}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pet.especie}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pet.raza || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pet.condicion}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pet.tamanio}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pet.sexo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDate(pet.createdAt)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ViewPet id={pet.id} />
                      <UpdatePet id={pet.id} />
                      <DeletePet id={pet.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}