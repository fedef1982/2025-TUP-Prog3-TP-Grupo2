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
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/donaciones`);
    console.log(token);
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

export async function fetchDonationById(id: number) {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Autenticación requerida');
    }

    console.log(`GET /usuarios/${userId}/donaciones/${id}`);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/donaciones/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' // Importante para datos que cambian
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; 
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener donación: ${response.status}`);
    }

    const donation = await response.json();
    return donation;

  } catch (error) {
    console.error('Error en fetchDonationById:', error);
    throw error; 
  }
}

export async function fetchDonationByUserId(userId: number) {
  try {
    console.log(`GET ${process.env.NEXT_PUBLIC_API_URL}/mascotas/${userId}/donaciones`);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mascotas/${userId}/donaciones`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    console.log("Response status:", response.status);

    if (response.status === 404) {
      console.log(`No donation found for user ${userId}`);
      return null;
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `Error al obtener datos de donacion: ${response.status} ${response.statusText}`
      );
    }
    
    const donation = await response.json();
    console.log("Donation found:", donation);
    return donation;

  } catch (error) {
    console.error('Error en fetchDonationByUserId:', error);
    return null;
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
  console.log ("format Donations for table:",donations);
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
    console.log(apiUrl);
    console.log(token);
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
    
    console.log("feth filtered donations data",data);
    console.log("feth filtered donations data.donations",data.donaciones);
    return {
      donations: data.donaciones,
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

  const response = await fetch(`${process.env.API_URL}/usuarios/${userId}/donationes`, {
    headers: {
      'Authorization': `Bearer ${await getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user pets');
  }
   
  return response.json();
}

