'use server';

import { getRawToken, getToken } from "./server-utils";
import { CreateUserDto, CreateUserState, LoginState, UpdateUserDto, UpdateUserState, User } from './definitions'
import { cookies } from 'next/headers';

export async function authenticate(
  prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email) {
      return {
        message: 'Email es requerido',
        errors: {
          email: ['Email es requerido'],
        },
      };
    }

    if (!password) {
      return {
        message: 'Contraseña es requerida',
        errors: {
          password: ['Contraseña es requerida'],
        },
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasenia: password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || 'Error en el login';
      
      return {
        message: errorMessage,
        errors: {
          email: errorData?.errors?.email,
          password: errorData?.errors?.password,
        },
      };
    }

    const { access_token: token } = await response.json();

    if (!token) {
      return {
        message: 'No se recibió token de autenticación',
      };
    }

    // Guardar token en cookies
    (await cookies()).set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24, // 1 día en segundos
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
   

    // Retornar éxito (la redirección debería manejarse en el cliente)
    return {
      success: true,
      message: 'Login exitoso',
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      message: error instanceof Error ? error.message : 'Error desconocido durante el login',
    };
  }
}

export async function createUser(
  prevState: CreateUserState | undefined,
  formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const contrasenia = formData.get('contrasenia') as string;
    const telefono = formData.get('telefono') as string || '';
    const direccion = formData.get('direccion') as string || '';
    const userData: CreateUserDto ={
        email: email,
        nombre: nombre,
        apellido: apellido,
        contrasenia: contrasenia,
        telefono: telefono,
        direccion: direccion,
    }
    console.log('######################################################');
    console.log(userData);
    console.log('######################################################');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Error en el registro. Por favor intente nuevamente.'
    };
  }
}

// Update user
export async function updateUser(
  id: number,
  prevState: UpdateUserState | undefined,
  formData: FormData
) {
  try {
    const email = formData.get('email') as string;
    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const contrasenia = formData.get('contrasenia') as string;
    const telefono = formData.get('telefono') as string || '';
    const direccion = formData.get('direccion') as string || '';

    const userData: Record<string, any> = {};
    
    if (email) userData.email = email;
    if (nombre) userData.nombre = nombre;
    if (apellido) userData.apellido = apellido;
    if (contrasenia) userData.contrasenia = contrasenia;
    if (telefono) userData.telefono = telefono;
    if (direccion) userData.direccion = direccion;

    console.log('######################################################');
    console.log('Updating user with ID:', id, 'Data:', userData);
    console.log('######################################################');
    
    const token = await getRawToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Update failed');
    }

    return { success: true };
  } catch (error) {
    console.error('Update error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar el usuario. Por favor intente nuevamente.'
    };
  }
}

// Delete user
export async function deleteUser(id: number): Promise<void> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to delete user with status ${response.status}`
      );
    }

  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
}
