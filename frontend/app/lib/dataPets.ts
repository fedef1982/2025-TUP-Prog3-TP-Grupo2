import { Pet, PetsTable, FilteredPet, Species, Condition, FilteredPetsParams, CreatePetDto, CreatePetState, UpdatePetDto, UpdatePetState } from "./definitionsPets";
import { getRawToken, getToken, getUserId, JwtPayload } from "./server-utils";
import jwt from 'jsonwebtoken';

export async function fetchAllPets(): Promise<Pet[]> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas`, {
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
        `Error al recuperar mascotas con estado ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error en fetchAllPets:', error);
    throw error;
  }
}

export async function fetchPetById(petId: number): Promise<Pet> {
  try {
    if (!petId) {
      throw new Error('Se requiere petId');
    }

    if (isNaN(petId)) {
      throw new Error('El ID de mascota debe ser numérico');
    }

    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas/${petId}`,
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
        `Error al obtener mascota: ${response.status} ${response.statusText}`
      );
    }

    const petData: Pet = await response.json();

    if (!petData.id || !petData.nombre || !petData.sexo || !petData.tamanio ) {
      throw new Error('Datos de mascota incompletos o inválidos');
    }

    return petData;
  } catch (error) {
    console.error(`Error en fetchPetById (petId: ${petId}):`, error);
    
    if (error instanceof Error) {
      throw new Error(`No se pudo obtener la mascota: ${error.message}`);
    }
    
    throw new Error('Error desconocido al obtener la mascota');
  }
}

export async function fetchPetsPages(query: string): Promise<number> {
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

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas/filtros?${params.toString()}`);

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

export function formatPetsForTable(pets: FilteredPet[]): PetsTable[] {
  if (!pets) {
    return [];
  }
  return pets.map(pet => ({
    id: pet.id.toString(),
    nombre: pet.nombre,
    raza: pet.raza,
    especie: pet.especie?.nombre || pet.especie_id.toString(), 
    condicion: pet.condicion?.nombre || pet.condicion_id.toString(),
    tamanio: pet.tamanio,
    sexo: pet.sexo,
    edad: pet.edad,
    vacunado: pet.vacunado,
    status: pet.status,
    createdAt: pet.createdAt|| new Date().toISOString()
  }));
}

export async function fetchFilteredPets({
  query = '', 
  page = 1, 
  limit = 5, 
  raza,
  especie_id, 
  condicion_id,
  tamanio,
  sexo,
  vacunado,
  minAge,
  maxAge,
  status,
  sortBy = 'nombre',
  sortOrder = 'asc'
}: FilteredPetsParams = {}): Promise<{ pets: FilteredPet[]; total: number; totalPages: number }> {
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

    if (especie_id !== undefined) {
      params.append('especie_id', especie_id.toString());
    }
    if (raza !== undefined) {
      params.append('raza', raza);
    }
    if (condicion_id !== undefined) {
      params.append('condicion_id', condicion_id.toString());
    }
    if (tamanio) {
      params.append('tamanio', tamanio);
    }
    if (sexo) {
      params.append('sexo', sexo);
    }
    if (vacunado !== undefined) {
      params.append('vacunado', vacunado.toString());
    }
    if (minAge !== undefined) {
      params.append('minAge', minAge.toString());
    }
    if (maxAge !== undefined) {
      params.append('maxAge', maxAge.toString());
    }
    if (status) {
      params.append('status', status);
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas/filtros?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'No se han podido recuperar las mascotas filtradas');
    }

    const data = await response.json();

    return {
      pets: data.mascotas,
      total: data.total,
      totalPages: data.totalPages
    };

  } catch (error) {
    console.error('Error al buscar mascotas filtradas:', error);
    throw new Error('Error al cargar los datos de mascotas. Por favor, inténtelo de nuevo.');
  }
}

export async function fetchAllSpecies(): Promise<Species[]> {
  try {
    const token = await getRawToken();
    
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/especies`, {
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
        `Error al recuperar especies con estado ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error en fetchAllSpecies:', error);
    throw error;
  }
}

export async function fetchAllConditions(): Promise<Condition[]> {
  try {
    const token = await getRawToken();
 
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/condiciones`, {
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
        `Error al recuperar condiciones con estado ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error en fetchAllConditions:', error);
    throw error;
  }
}

export async function fetchUserPets(): Promise<Pet[]> {
  const response = await fetch(`${process.env.API_URL}/usuario/mascotas`, {
    headers: {
      'Authorization': `Bearer ${await getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user pets');
  }
  
  return response.json();
}
