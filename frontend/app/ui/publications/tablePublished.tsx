import { ViewPublished } from '@/app/ui/publications/buttons';
import { fetchFilteredPublished } from '@/app/lib/dataPublications';

export default async function PublicationsTablePublished({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { publicaciones } = await fetchFilteredPublished({
    query,
    page: currentPage,
  });

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-200 p-2 md:pt-0">
          <div className="md:hidden">
            {publicaciones?.map((pub) => (
              <div
                key={pub.id}
                className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="font-medium">{pub.titulo}</p>
                    </div>
                    <p className="text-sm text-gray-500">Mascota: {pub.mascota.nombre}</p>
                    <p className="text-sm text-gray-500">Ubicación: {pub.ubicacion}</p>
                    <p className="text-sm text-gray-500 truncate">Descripción: {pub.descripcion}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <ViewPublished id={pub.id.toString()} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">Fotos</th>
                <th className="px-3 py-5 font-medium">Publicación</th>
                <th className="px-3 py-5 font-medium">Mascota</th>
                <th className="py-3 pl-6 pr-3 font-medium">
                  <span className="sr-only">Ver</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {publicaciones?.map((pub) => (
                <tr
                  key={pub.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none
                    [&:first-child>td:first-child]:rounded-tl-lg
                    [&:first-child>td:last-child]:rounded-tr-lg
                    [&:last-child>td:first-child]:rounded-bl-lg
                    [&:last-child>td:last-child]:rounded-br-lg"
                >
                  {/* FOTOS */}
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {pub.mascota.fotos_url && pub.mascota.fotos_url.length > 0 ? (
                        <div className="relative h-40 w-64 rounded-md overflow-hidden bg-gray-300">
                          <img
                            src={
                              pub.mascota.fotos_url[0].startsWith('/dashboard/')
                                ? pub.mascota.fotos_url[0].replace('/dashboard/', '/images/')
                                : pub.mascota.fotos_url[0].startsWith('/images/')
                                ? pub.mascota.fotos_url[0]
                                : `/images/${pub.mascota.fotos_url[0]}`
                            }
                            alt={`Foto de ${pub.mascota.nombre}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="h-40 w-64 rounded-md bg-gray-300 flex items-center justify-center text-gray-400">
                          Sin foto
                        </div>
                      )}
                    </div>
                  </td>
                  {/* PUBLICACIÓN */}
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <div>
                      <div className="font-semibold text-base mb-1">{pub.titulo}</div>
                      <div className="text-gray-500 text-sm">Descripción: {pub.descripcion}</div>
                      <div className="text-gray-500 text-sm">Ubicación: {pub.ubicacion}</div>
                      <div className="text-gray-500 text-sm">Contacto: {pub.contacto}</div>
                    </div>
                  </td>
                  {/* MASCOTA */}
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <div>
                      <div className="font-semibold">{pub.mascota.nombre}</div>
                      <div className="text-gray-500 text-sm">Raza: {pub.mascota.raza || '-'}</div>
                      <div className="text-gray-500 text-sm">Sexo: {pub.mascota.sexo || '-'}</div>
                    </div>
                  </td>
                  {/* VER PUBLICACIÓN */}
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 align-top">
                    <div className="flex justify-end gap-3">
                      <ViewPublished id={pub.id.toString()} />
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