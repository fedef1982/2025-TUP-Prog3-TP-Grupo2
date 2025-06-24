import { url } from "inspector";
import { Publication, PublicationsResponse, FilteredPublication, PublicationWithPet, FilteredPublicationsParams, PublicationsTable } from "./definitionsPublications";
import { getRawToken, getToken, getUserId } from "./server-utils";
import { Pet } from "./definitionsPets";

export async function fetchAllPublications(): Promise<Publication[]> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones`, {
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
        `Error fetching publications with status ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error in fetchAllPublications:', error);
    throw error;
  }
}

export async function fetchPublicationById(publicationId: number): Promise<PublicationWithPet> {
  try {
    if (!publicationId) {
      throw new Error('Publication ID is required');
    }

    if (isNaN(publicationId)) {
      throw new Error('Publication ID must be numeric');
    }

    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones/${publicationId}`,
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
        `Error fetching publication: ${response.status} ${response.statusText}`
      );
    }

    const publicationData: PublicationWithPet = await response.json();

    if (!publicationData.id || !publicationData.titulo || !publicationData.descripcion) {
      throw new Error('Incomplete or invalid publication data');
    }

    return publicationData;
  } catch (error) {
    console.error(`Error in fetchPublicationById (publicationId: ${publicationId}):`, error);
    
    if (error instanceof Error) {
      throw new Error(`Could not fetch publication: ${error.message}`);
    }
    
    throw new Error('Unknown error fetching publication');
  }
}

export async function fetchPublicPublications(): Promise<PublicationWithPet[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/publicaciones`,
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
        `Error fetching public publications: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchPublicPublications:', error);
    throw new Error('Could not fetch public publications');
  }
}

export async function fetchPublicationsPages(query: string): Promise<number> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const page = 1;
    const limit = 5;
    const sortBy = 'titulo';
    const sortOrder = 'asc';

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones/filtros?${params.toString()}`);

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
      throw new Error(errorData.message || 'Error fetching total pages');
    }

    const data = await response.json();

    return data.totalPages || 1; 
    
  } catch (error) {
    console.error('Error fetching total pages:', error);
    return 1;
  }
}

export async function fetchFilteredPublications({
  query = '', 
  page = 1, 
  limit = 5, 
  estado,
  sortBy = 'titulo',
  sortOrder = 'asc',
  published
}: FilteredPublicationsParams = {}): Promise<PublicationsResponse> {
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
    if (published !== undefined) {
      params.append('published', published.toString());
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones/filtros?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error fetching filtered publications');
    }

    const data = await response.json();
    console.log('######### data de la publicacion', JSON.stringify(data));

    return data;

  } catch (error) {
    console.error('Error fetching filtered publications:', error);
    throw new Error('Error loading publication data. Please try again.');
  }
}

/*export function formatPublishedForTable(published: FilteredPublication[]): PublicationsTable[] {
  if (!published) {
    return [];
  }
  return published.map(publi => ({
    id: publi.id.toString(),
    titulo: publi.titulo,
    descripcion: publi.descripcion,
    ubicacion: publi.ubicacion, 
    status: publi.estado,
    createdAt: publi.createdAt|| new Date().toISOString()
  }));
}*/

export async function fetchPublishedPages(query: string): Promise<number> {
  try {
    const page = 1;
    const limit = 5;
    const sortBy = 'titulo';
    const sortOrder = 'asc';

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/publicaciones/filtros?${params.toString()}`);

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {},
      next: { revalidate: 3600 }
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

export async function fetchFilteredPublished({
  query = '', 
  page = 1, 
  limit = 5, 
  estado,
  sortBy = 'titulo',
  sortOrder = 'asc',
  published
}: FilteredPublicationsParams = {}): Promise<PublicationsResponse> {
  try {

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
    if (published !== undefined) {
      params.append('published', published.toString());
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/publicaciones/filtros?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {},
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error fetching filtered publications');
    }

    return await response.json();

  } catch (error) {
    console.error('Error fetching filtered publications:', error);
    throw new Error('Error loading publication data. Please try again.');
  }
}

