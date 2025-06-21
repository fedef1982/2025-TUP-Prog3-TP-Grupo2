import { UpdatePublication, DeletePublication, ViewPublication } from '@/app/ui/publications/buttons';
import { fetchFilteredPublications } from '@/app/lib/dataPublications';
import PublicationStatus from '@/app/ui/publications/status';

export default async function PublicationsTablePublished({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { publications, total, totalPages } = await fetchFilteredPublications({
    query,
    page: currentPage,
  });

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-200 p-2 md:pt-0">
          <div className="md:hidden">
            {publications?.map((pub) => (
              <div
                key={pub.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="font-medium">{pub.titulo}</p>
                      <PublicationStatus 
                        status={pub.estado} 
                        published={pub.publicado}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Pet: {pub.mascota.nombre}</p>
                    <p className="text-sm text-gray-500">Location: {pub.ubicacion}</p>
                    <p className="text-sm text-gray-500 truncate">Description: {pub.descripcion}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <ViewPublication id={pub.id.toString()} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Mascota
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fotos
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Información
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {publications?.map((pub) => (
                <tr
                  key={pub.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="truncate max-w-xs">{pub.titulo}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pub.mascota.nombre}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pub.ubicacion}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <PublicationStatus 
                      status={pub.estado} 
                      published={pub.publicado} 
                    />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ViewPublication id={pub.id.toString()} />
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