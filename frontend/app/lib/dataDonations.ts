import { Donation, DonationsTable, FilteredDonations, FilteredDonationsParams, CreateDonationDto, CreateDonationState, UpdateDonationDto, UpdateDonationState } from "./definitionsDonations";
import { getRawToken, getToken, getUserId, JwtPayload } from "./server-utils";
import jwt from 'jsonwebtoken';

export async function fetchAllDonations(): Promise<Donation[]> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/${userId}/donaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error al recuperar datos donacion con estado ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error en fetchAllDonation:', error);
    throw error;
  }
}

export async function fetchDonationById(donationId: number): Promise<Donation> {
  try {
    if (!donationId) {
      throw new Error('Se requiere donationId');
    }

    if (isNaN(donationId)) {
      throw new Error('El ID de dato de donacion debe ser numérico');
    }

    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuario/${userId}/donaciones/${donationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `Error al obtener datos de donacion: ${response.status} ${response.statusText}`
      );
    }

    const donationData: Donation = await response.json();

    if (!donationData.id || !donationData.destinatario || !donationData.entidad_financiera || !donationData.alias ) {
      throw new Error('Datos de donacion incompletos o inválidos');
    }

    return donationData;
  } catch (error) {
    console.error(`Error en fetchDonationById (donationId: ${donationId}):`, error);
    
    if (error instanceof Error) {
      throw new Error(`No se pudo obtener la datos de donacion: ${error.message}`);
    }
    
    throw new Error('Error desconocido al obtener datos de donacion');
  }
}

export async function fetchDonationByUserId(userId: number): Promise<Donation> {
  try {
    if (!userId) {
      throw new Error('Se requiere userId');
    }

    if (isNaN(userId)) {
      throw new Error('El ID de dato de donacion debe ser numérico');
    }

    console.log(`${process.env.NEXT_PUBLIC_API_URL}/mascota/${userId}/donaciones`);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mascota/${userId}/donaciones`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `Error al obtener datos de donacion: ${response.status} ${response.statusText}`
      );
    }

    const donationData: Donation = await response.json();

    if (!donationData.id || !donationData.destinatario || !donationData.entidad_financiera || !donationData.alias ) {
      throw new Error('Datos de donacion incompletos o inválidos');
    }

    return donationData;
  } catch (error) {
    console.error(`Error en fetchDonationByUserId (userId: ${userId}):`, error);
    
    if (error instanceof Error) {
      throw new Error(`No se pudo obtener la datos de donacion: ${error.message}`);
    }
    
    throw new Error('Error desconocido al obtener datos de donacion');
  }
}

export async function fetchDonationPages(query: string): Promise<number> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const page = 1;
    const limit = 5;
    const sortBy = 'destinatario';
    const sortOrder = 'asc';

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/donaciones/filtros?${params.toString()}`);

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al recuperar el total de páginas');
    }

    const data = await response.json();

    return data.totalPages || 1; 
    
  } catch (error) {
    console.error('Error al recuperar el total de páginas:', error);
    return 1;
  }
}

export function formatDonationsForTable(donations: FilteredDonations[]): DonationsTable[] {
  if (!donations) {
    return [];
  }
  return donations.map(donation => ({
    id: donation.id.toString(),
    destinatario: donation.destinatario,
    entidad_financiera: donation.entidad_financiera,
    alias: donation.alias,
    usuario_id: donation.usuario_id.toString(),
    createdAt: donation.createdAt|| new Date().toISOString()
  }));
}

export async function fetchFilteredDonations({
  query = '', 
  page = 1, 
  limit = 5, 
  destinatario,
  entidad_financiera, 
  alias,
  sortBy = 'destinatario',
  sortOrder = 'asc'
}: FilteredDonationsParams = {}): Promise<{ donations: FilteredDonations[]; total: number; totalPages: number }> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    if (destinatario !== undefined) {
      params.append('destinatario', destinatario.toString());
    }
    if (entidad_financiera !== undefined) {
      params.append('entidad_financiera', entidad_financiera.toString());
    }
    if (alias !== undefined) {
      params.append('alias', alias.toString());
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/donaciones/filtros?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'No se han podido recuperar los datos de donacion filtradas');
    }

    const data = await response.json();

    return {
      donations: data.donations,
      total: data.total,
      totalPages: data.totalPages
    };

  } catch (error) {
    console.error('Error al buscar mascotas filtradas:', error);
    throw new Error('Error al cargar los datos de mascotas. Por favor, inténtelo de nuevo.');
  }
}

export async function fetchUserDonations(): Promise<Donation[]> {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

  const response = await fetch(`${process.env.API_URL}/usuario/${userId}/donationes`, {
    headers: {
      'Authorization': `Bearer ${await getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user pets');
  }
  
  return response.json();
}

