'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const UserSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select a user status.',
  }),
  date: z.string(),
});

const CreateUser = UserSchema.omit({ id: true, date: true });
const UpdateUser = UserSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

async function apiRequest(endpoint: string, options: RequestInit) {
  const token = (await cookies()).get('session-token')?.value;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  try {
    await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        amount: amount * 100,
        status,
        date: new Date().toISOString().split('T')[0],
      }),
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'API Error: Failed to Create User',
    };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function updateUser(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateUser.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  try {
    await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        customer_id: customerId,
        amount: amount * 100,
        status,
      }),
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'API Error: Failed to Update User',
    };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function deleteUser(id: string) {
  try {
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
    revalidatePath('/dashboard/users');
    return { message: 'User deleted successfully' };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'API Error: Failed to Delete User',
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// Additional API consumer functions
export async function fetchUserStats() {
  try {
    return await apiRequest('/users/stats', { method: 'GET' });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
      adminUsers: 0,
      inactiveUsers: 0,
      premiumUsers: 0
    };
  }
}

export async function fetchLatestUsers() {
  try {
    const data = await apiRequest('/users/latest', { method: 'GET' });
    return data.map((user: any) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      image_url: user.avatar || '/default-avatar.png',
      amount: (user.amount / 100).toFixed(2),
      status: user.status
    }));
  } catch (error) {
    console.error('Failed to fetch latest users:', error);
    return [];
  }
}