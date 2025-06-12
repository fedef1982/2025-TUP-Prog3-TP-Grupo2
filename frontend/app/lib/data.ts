import { cookies } from "next/headers";
import { LatestUser, User, UsersTable } from "./definitions";

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
      name: `${user.nombre} ${user.apellido}`,
      email: user.email,
      image_url: '/default-avatar.png', // Valor por defecto
      phone: user.telefono,
      role: user.rol_id === 1 ? 'Admin' : 'User', // Asumiendo 1=Admin
      status: user.deletedAt === null ? 'active' : 'inactive'
    }));

  } catch (error) {
    console.error('Failed to fetch latest users:', error);
    throw new Error('Failed to fetch latest users');
  }
}

// Función para obtener un usuario específico
export async function fetchUserById(id: string): Promise<User> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${(await cookies()).get('token')?.value}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  const user = await response.json();
  
  return {
    id: user.id.toString(),
    name: `${user.nombre} ${user.apellido}`,
    email: user.email,
    password: user.contrasenia,
    role_id: user.rol_id,
    phone: user.telefono,
    address: user.direccion,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt
  };
}

// Función para formatear usuarios para tablas
export function formatUsersForTable(users: any[]): UsersTable[] {
  return users.map(user => ({
    id: user.id.toString(),
    name: `${user.nombre} ${user.apellido}`,
    email: user.email,
    image_url: '/default-avatar.png',
    phone: user.telefono,
    role: user.rol_id === 1 ? 'Admin' : 'User',
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    status: user.deletedAt === null ? 'active' : 'inactive'
  }));
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  adminUsers: number;
  inactiveUsers: number;
  premiumUsers: number;
}

/*export async function fetchUserStats(): Promise<UserStats> {
  try {
    // 1. Obtener token de autenticación
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      throw new Error('No authentication token found');
    }

    // 2. Configurar la petición a la API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/users/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 } // Revalidar cada hora
    });

    // 3. Manejar errores de la respuesta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to fetch user stats with status ${response.status}`
      );
    }

    // 4. Procesar y transformar los datos de la API
    const apiData = await response.json();

    return {
      totalUsers: apiData.total_users || 0,
      activeUsers: apiData.active_users || 0,
      pendingUsers: apiData.pending_approval || 0,
      adminUsers: apiData.admin_count || 0,
      inactiveUsers: apiData.inactive_users || 0,
      premiumUsers: apiData.premium_subscribers || 0
    };

  } catch (error) {
    console.error('Error in fetchUserStats:', error);
    
    // 5. Retornar valores por defecto en caso de error
    return {
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
      adminUsers: 0,
      inactiveUsers: 0,
      premiumUsers: 0
    };
  }
}*/

interface FilteredUsersParams {
  query?: string;
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'pending';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilteredUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  role: string;
  imageUrl: string;
}

export async function fetchFilteredUsers(filter: string, currentPage: number, {
  query = '', page = 1, limit = 10, status, sortBy = 'name', sortOrder = 'asc'
}: FilteredUsersParams = {}): Promise<FilteredUser[]> {
  try {
    const token = (await cookies()).get('session-token')?.value;
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Construir parámetros de consulta
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    if (status) {
      params.append('status', status);
    }

    const apiUrl = `${process.env.API_BASE_URL}/users/filter?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 } // Revalidar cada hora
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch filtered users');
    }

    const apiData = await response.json();

    // Mapear y transformar los datos de la API
    return apiData.users.map((user: any) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      status: user.accountStatus || 'inactive',
      lastLogin: user.lastLoginDate || 'Never',
      role: user.role || 'user',
      imageUrl: user.profileImage || '/default-avatar.png'
    }));

  } catch (error) {
    console.error('Error fetching filtered users:', error);
    throw new Error('Failed to load user data. Please try again.');
  }
}

export async function fetchUsersPages(query: string): Promise<number> {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Construir la URL con parámetros de consulta
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/pages`);
    apiUrl.searchParams.append('query', query);

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 } // Revalidar cada hora
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch total pages');
    }

    const data = await response.json();
    return data.totalPages || 1; // Retorna 1 como valor por defecto si no hay datos
    
  } catch (error) {
    console.error('Failed to fetch total pages:', error);
    return 1; // Retorna 1 página como fallback
  }
}