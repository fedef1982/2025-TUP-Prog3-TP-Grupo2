import { cookies } from "next/headers";
import { User, UsersTable, Role, UserStats, FilteredUser } from "./definitions";
import { getRawToken, getToken, getUserId } from "./server-utils";

export async function fetchAllUsers(): Promise<User[]> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
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
        `Error al recuperar usuarios con estado ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error en fetchAllUsers:', error);
    throw error;
  }
}

export async function fetchUserById(userId: number): Promise<User> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}`, {
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
        throw new Error(`El usuario con id ${userId} no existe`);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error al obtener el usuario: ${response.statusText} (${response.status})`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error(`Error al buscar un usuario con ID ${userId}:`, error);
    throw error;
  }
}

export async function fetchCurrentUserProfile(): Promise<User> {
  try {
    const tokenPl = await getToken();
    if (!tokenPl?.sub) {
      throw new Error('No se ha encontrado ID de usuario en el token');
    }

    const userId = Number(tokenPl.sub);
    return await fetchUserById(userId);
  } catch (error) {
    console.error('Error en fetchCurrentUserProfile:', error);
    throw error;
  }
}

export async function fetchCurrentUserId() {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No se ha encontrado ID de usuario en el token');
    }

    return userId;
  } catch (error) {
    console.error('Error en fetchCurrentUserId:', error);
    throw error;
  }
  
}

export async function fetchUserStats(): Promise<UserStats> {
  try {
    const token = await getRawToken();
    const tokenPl = await getToken();
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const id = tokenPl?.sub;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}/estadisticas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error al recuperar las estadísticas de usuario con estado ${response.status}`
      );
    }

    const stats = await response.json();

    return {
      totalUsers: stats.totalUsuarios  || 0,
      totalPets: stats.totalMascotas || 0,
      totalPublications: stats.totalPublicaciones || 0,
      totalVisits: stats.totalVisitas || 0,
    };

  } catch (error) {
    console.error('Error en fetchUserStats:', error);
    
    return {
      totalUsers: 0,
      totalPets: 0,
      totalPublications: 0,
      totalVisits: 0,
    };
  }
}

export async function fetchUsersPages(query: string): Promise<number> {
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

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}/filtros?${params.toString()}`);

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

export function formatUsersForTable(users: FilteredUser[]): UsersTable[] {
  return users.map(user => ({
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role_id === 1 ? Role.ADMIN : Role.PUBLICADOR,
    createdAt: user.createdAt,
    status: user.status
  }));
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
} = {}): Promise<{ users: FilteredUser[]; total: number; totalPages: number }> {
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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}/filtros?${params.toString()}`;

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
      users: data.users.map((user: any) => ({
        id: user.id.toString(),
        name: user.nombre,
        lastname: user.apellido, 
        email: user.email,
        role: Number(user.role_id),
        phone: user.telefono,
        address: user.direccion,
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
        status: user.deletedAt ? 'Inactivo' : 'Activo'
      })),
      total: data.total,
      totalPages: data.totalPages
    };

  } catch (error) {
    console.error('Error al buscar usuarios filtrados:', error);
    throw new Error('Error al cargar los datos de usuario. Por favor, inténtelo de nuevo.');
  }
}