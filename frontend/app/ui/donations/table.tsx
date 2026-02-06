import { UpdateDonation, DeleteDonation, ViewDonation } from '@/app/ui/donations/buttons';
import { fetchFilteredDonations, formatDonationsForTable } from '@/app/lib/dataDonations';

export default async function DonationsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const donations = await fetchFilteredDonations({
    query,
    page: currentPage
  });
  const formattedDonations = formatDonationsForTable(donations.donations);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-200 p-2 md:pt-0">
          <div className="md:hidden">
            {formattedDonations?.map((donation) => (
              <div
                key={donation.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="font-medium">{donation.destinatario}</p>
                    </div>
                    <p className="text-sm text-gray-500">Entidad Financiera: {donation.entidad_financiera}</p>
                    <p className="text-sm text-gray-500">Alias: {donation.alias}</p>
                    <p className="text-sm text-gray-500">Usuario: {donation.usuario_id}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                      <p className="text-sm">Fecha creación: {donation.createdAt}</p>
                  </div> 
                  <div className="flex justify-end gap-2">
                    <ViewDonation id={donation.id} />
                    <UpdateDonation id={donation.id} />
                    <DeleteDonation id={donation.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Destinatario
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Entidad Financiera
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Alias
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Usuario ID
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
              {formattedDonations?.map((donation) => (
                <tr
                  key={donation.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{donation.destinatario}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-3">
                      <p>{donation.entidad_financiera}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-3">
                      <p>{donation.alias || '-'}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-3">
                      <p className="text-sm">{donation.createdAt || '-'}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex justify-end gap-2">
                      <ViewDonation id={donation.id} />
                      <UpdateDonation id={donation.id} />
                      <DeleteDonation id={donation.id} />
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