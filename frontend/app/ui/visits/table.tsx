import { DeleteVisit, ViewVisit, ApproveVisit, RejectVisit } from '@/app/ui/visits/buttons';
import { fetchFilteredVisits } from '@/app/lib/dataVisits';
import VisitStatus from '@/app/ui/visits/status';

export default async function VisitsTable({
  query,
  currentPage,
  userId
}: {
  query: string;
  currentPage: number;
  userId: number;
}) {
  const { visitas, total, totalPages } = await fetchFilteredVisits({
    query,
    page: currentPage,
    limit: 5,

  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeSlot: string) => {
    switch(timeSlot) {
      case 'Maniana': return 'Mañana (9:00-12:00)';
      case 'Tarde': return 'Tarde (14:00-18:00)';
      case 'Noche': return 'Noche (19:00-21:00)';
      default: return timeSlot;
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-200 p-2 md:pt-0">
          <div className="md:hidden">
            {visitas?.map((visit) => (
              <div
                key={visit.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="font-medium">{visit.nombre} {visit.apellido}</p>
                      <VisitStatus status={visit.estado} />
                    </div>
                    <p className="text-sm text-gray-500">Publicación: {visit.publicacion?.titulo || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Fecha: {formatDate(visit.disponibilidad_fecha)}</p>
                    <p className="text-sm text-gray-500">Horario: {formatTime(visit.disponibilidad_horario)}</p>
                    <p className="text-sm text-gray-500">Contacto: {visit.email} | {visit.telefono}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm">Solicitado: {formatDate(visit.createdAt)}</p>
                    <p className="text-sm">Tracking: {visit.tracking}</p>
                  </div> 
                  <div className="flex justify-end gap-2">
                    <ViewVisit id={visit.id.toString()} />
                    <ApproveVisit id={visit.id.toString()} userId={userId.toString()} />
                    <RejectVisit id={visit.id.toString()} userId={userId.toString()} />
                    <DeleteVisit id={visit.id.toString()} userId={userId.toString()} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Visitante
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Mascota
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha/Horario
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tracking
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {visitas?.map((visit) => (
                <tr
                  key={visit.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex flex-col gap-1">
                      <p>{visit.nombre}</p>
                      <p>{visit.apellido}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {visit.publicacion?.mascota.nombre || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div>
                      <p>{formatDate(visit.disponibilidad_fecha)}</p>
                      <p className="text-gray-500">{formatTime(visit.disponibilidad_horario)}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="truncate max-w-xs">{visit.tracking}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <VisitStatus status={visit.estado} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ViewVisit id={visit.id.toString()} />
                      <DeleteVisit id={visit.id.toString()} userId={userId.toString()} />
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