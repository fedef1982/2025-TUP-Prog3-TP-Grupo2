import { Visita, VisitasResponse, FilteredVisita, VisitaWithPublication, FilteredVisitasParams, VisitasTable, TrackingVisita, CreateVisitaDto, UpdateVisitaDto } from "./definitionsVisits";
import { getRawToken, getToken, getUserId } from "./server-utils";

export async function fetchAllVisits(userId: number): Promise<Visita[]> {
  try {
    const token = await getRawToken();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/visitas`, {
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
        `Error fetching visits with status ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error in fetchAllVisits:', error);
    throw error;
  }
}

export async function fetchVisitById(visitId: number, userId: number): Promise<VisitaWithPublication> {
  try {
    if (!visitId || !userId) {
      throw new Error('Visit ID and User ID are required');
    }

    if (isNaN(visitId)) {
      throw new Error('Visit ID must be numeric');
    }

    const token = await getRawToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/visitas/${visitId}`,
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
        `Error fetching visit: ${response.status} ${response.statusText}`
      );
    }

    const visitData: VisitaWithPublication = await response.json();

    if (!visitData.id || !visitData.nombre || !visitData.apellido) {
      throw new Error('Incomplete or invalid visit data');
    }

    return visitData;
  } catch (error) {
    console.error(`Error in fetchVisitById (visitId: ${visitId}):`, error);
    
    if (error instanceof Error) {
      throw new Error(`Could not fetch visit: ${error.message}`);
    }
    
    throw new Error('Unknown error fetching visit');
  }
}

export async function fetchTrackingVisit(tracking: string): Promise<TrackingVisita> {
  try {
    if (!tracking) {
      throw new Error('Tracking ID is required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/visitas/seguimiento/${tracking}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `Error fetching visit tracking: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchTrackingVisit:', error);
    throw new Error('Could not fetch visit tracking information');
  }
}

export async function fetchVisitsPages(query: string): Promise<number> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

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

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/visitas/filtros?${params.toString()}`);

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error fetching total pages');
    }

    const data = await response.json();

    return data.totalPages || 1; 
    
  } catch (error) {
    console.error('Error fetching total pages:', error);
    return 1;
  }
}

export async function fetchFilteredVisits({
  query = '', 
  page = 1, 
  limit = 5, 
  estado,
  sortBy = 'nombre',
  sortOrder = 'asc',
}: FilteredVisitasParams): Promise<VisitasResponse> {
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

    if (estado) {
      params.append('estado', estado);
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/visitas/filtros?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error fetching filtered visits');
    }

    const data = await response.json();
 

    return data;

  } catch (error) {
    console.error('Error fetching filtered visits:', error);
    throw new Error('Error loading visit data. Please try again.');
  }
}

export function formatVisitsForTable(visits: FilteredVisita[]): VisitasTable[] {
  if (!visits) {
    return [];
  }
  return visits.map(visit => ({
    id: visit.id.toString(),
    nombre: visit.nombre,
    apellido: visit.apellido,
    email: visit.email,
    estado: visit.estado,
    disponibilidad_fecha: visit.disponibilidad_fecha.toISOString(),
    disponibilidad_horario: visit.disponibilidad_horario,
    tracking: visit.tracking,
    publicacion: visit.publicacion?.titulo || 'N/A',
    createdAt: visit.createdAt?.toISOString() || new Date().toISOString()
  }));
}