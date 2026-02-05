import { cookies } from "next/headers";
import { Donation, DonationsTable, FilteredDonations } from "./definitionsDonations";
import { getRawToken, getToken, getUserId } from "./server-utils";

export async function fetchAllDonations(): Promise<Donation[]> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donaciones`, {
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
        `Error al recuperar datos donaciones con estado ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error en fetchAllDonations:', error);
    throw error;
  }
}

export async function fetchDonationById(donationId: number): Promise<Donation> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donaciones/${donationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('No tienes permisos para acceder a este recurso (se requiere rol ADMIN)');
      }
      if (response.status === 404) {
        throw new Error(`El dato de donacion con id ${donationId} no existe`);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error al obtener el dato de donacion: ${response.statusText} (${response.status})`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error(`Error al buscar un dato de dobacion con ID ${donationId}:`, error);
    throw error;
  }
}

export async function fetchCurrentDonationProfile(): Promise<Donation> {
  try {
    const tokenPl = await getToken();
    if (!tokenPl?.sub) {
      throw new Error('No se ha encontrado ID de usuario en el token');
    }

    const donationId = Number(tokenPl.sub);
    return await fetchDonationById(donationId);
  } catch (error) {
    console.error('Error en fetchCurrentUserProfile:', error);
    throw error;
  }
}

export async function fetchCurrentDonationId() {
  try {
    const donationId = await getUserId();
    if (!donationId) {
      throw new Error('No se ha encontrado ID de donacion en el token');
    }

    return donationId;
  } catch (error) {
    console.error('Error en fetchCurrentDonationId:', error);
    throw error;
  }
  
}


export async function fetchDonationsPages(query: string): Promise<number> {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }
    const tokenPl = await getToken();
    const id = tokenPl?.sub;  

    const page = 1;
    const limit = 5;
    const sortBy = 'nombre';
    const sortOrder = 'asc';

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/donaciones/${id}/filtros?${params.toString()}`);

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
     // next: { revalidate: 3600 }
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

export function formatUsersForTable(donations: FilteredDonations[]): DonationsTable[] {
  return donations.map(donation => {
    let fechaFormateada = 'Fecha no disponible';
    if (donation.createdAt) {
      let fechaStr = donation.createdAt as string;
      if (fechaStr.includes(' ')) {
        fechaStr = fechaStr.replace(' ', 'T');
      }
      const date = new Date(fechaStr);
      if (!isNaN(date.getTime())) {
        fechaFormateada = date.toISOString().split('T')[0];
      }
    }
    return {
      id: donation.id,
      name: donation.name,
      lastname: donation.lastname,
      email: donation.email,
      phone: donation.phone,
      address: donation.address,
      role: donation.role_id === 1 ? 'Admin' : 
            donation.role_id === 2 ? 'Publicador' : 
            'Desconocido',
      createdAt: donation.createdAt,
      status: donation.status
    };
  });
}

export async function fetchFilteredUsers({
  query = '', 
  page = 1, 
  limit = 5, 
  rol_id, 
  sortBy = 'nombre', 
  sortOrder = 'asc'
}: {
  query?: string;
  page?: number | string;
  limit?: number | string;
  rol_id?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<{ donations: FilteredDonations[]; total: number; totalPages: number }> {
  try {

    const token = (await cookies()).get('token')?.value;
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const tokenPl = await getToken();
    const id = tokenPl?.sub; 

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    if (rol_id !== undefined) {
      params.append('rol_id', rol_id.toString());
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/donaciones/${id}/filtros?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'No se han podido recuperar los usuarios filtrados');
    }

    const data = await response.json();

    return {
      donations: data.donations.map((donation: any) => ({
        id: donation.id.toString(),
        name: donation.nombre,
        lastname: donation.apellido, 
        email: donation.email,
        role_id: donation.rol_id,
        rol: donation.rol,
        phone: donation.telefono,
        address: donation.direccion,
        createdAt: donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : '',
        status: donation.deletedAt ? 'Inactivo' : 'Activo'
      })),
      total: data.total,
      totalPages: data.totalPages
    };

  } catch (error) {
    console.error('Error al buscar datos de donaciones filtrados:', error);
    throw new Error('Error al cargar los datos de donaciones. Por favor, inténtelo de nuevo.');
  }
}