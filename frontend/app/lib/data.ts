import { cookies } from "next/headers";
import { LatestUser, User, UsersTable, Role, UserStats, FilteredUser } from "./definitions";
import { getRawToken, getToken } from "./server-utils";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

// Fetch all users (admin only)
export async function fetchAllUsers(): Promise<User[]> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No authentication token found');
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
        `Failed to fetch users with status ${response.status}`
      );
    }
    
    return await response.json();

  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    throw error;
  }
}

// Fetch user profile (admin or own profile)
export async function fetchUserById(userId: number): Promise<User> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No authentication token found');
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
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
}

// Fetch current user profile (uses the token's sub as ID)
export async function fetchCurrentUserProfile(): Promise<User> {
  try {
    const token = await getToken();
    if (!token?.sub) {
      throw new Error('No user ID found in token');
    }

    const userId = Number(token.sub);
    return await fetchUserById(userId);
  } catch (error) {
    console.error('Error in fetchCurrentUserProfile:', error);
    throw error;
  }
}

export async function fetchLatestUsers(): Promise<LatestUser[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await cookies()).get('token')?.value}`
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const usersData = await response.json();

    return usersData.map((user: any) => ({
      id: user.id.toString(),
      name: user.nombre,
      lastname: user.apellido,
      email: user.email,
      phone: user.telefono,
      address: user.direccion,
      role: user.rol_id === 1 ? Role.ADMIN : Role.PUBLICADOR, 
    }));

  } catch (error) {
    console.error('Failed to fetch latest users:', error);
    throw new Error('Failed to fetch latest users');
  }
}

export async function fetchUserStats(): Promise<UserStats> {
  try {
    const token = await getRawToken();
    const jwttoken = await getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const id = jwttoken?.sub;

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
        `Failed to fetch user stats with status ${response.status}`
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
    console.error('Error in fetchUserStats:', error);
    
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
      throw new Error('No authentication token found');
    }
    const tokenPl = await getToken();
    const id = tokenPl?.sub;  

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}/filtros`);
    apiUrl.searchParams.append('query', query);

    console.log('#########################');
    console.log(apiUrl);
    console.log('#########################');

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
      throw new Error(errorData.message || 'Failed to fetch total pages');
    }

    const data = await response.json();
    return data.totalPages || 1; 
    
  } catch (error) {
    console.error('Failed to fetch total pages:', error);
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
  limit = 10, 
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
} = {}): Promise<{ users: FilteredUser[]; total: number }> {
  try {

    const token = (await cookies()).get('token')?.value;
    if (!token) {
      throw new Error('No authentication token found');
    }

    const jwttoken = await getToken();
    const id = jwttoken?.sub; 

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
    console.log('###########################################');
    console.log('Request URL:', apiUrl);
    console.log('###########################################');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch filtered users');
    }

    const data = await response.json();

    console.log('###########################################');
    console.log('Respose:', data);
    console.log('###########################################');

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
      total: data.total
    };

  } catch (error) {
    console.error('Error fetching filtered users:', error);
    throw new Error('Failed to load user data. Please try again.');
  }
}