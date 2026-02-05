'use server';

import { getRawToken, getToken } from "./server-utils";
import { CreateDonationDto, UpdateDonationDto, Donation, UpdateDonationState, CreateDonationState } from './definitionsDonations'
import { cookies } from 'next/headers';

// Create donation
export async function createDonation(
  prevState: CreateDonationState | undefined,
  formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const contrasenia = formData.get('contrasenia') as string;
    const telefono = formData.get('telefono') as string || '';
    const direccion = formData.get('direccion') as string || '';
    const donationData: CreateDonationDto ={
        email: email,
        nombre: nombre,
        apellido: apellido,
        contrasenia: contrasenia,
        telefono: telefono,
        direccion: direccion,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData),
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
      error: error instanceof Error ? error.message : 'Error en datos donaciones. Por favor intente nuevamente.'
    };
  }
}

// Update donation
export async function updateDonation(
  id: number,
  prevState: UpdateDonationState | undefined,
  formData: FormData
) {
  try {
    const email = formData.get('email') as string;
    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const contrasenia = formData.get('contrasenia') as string;
    const telefono = formData.get('telefono') as string || '';
    const direccion = formData.get('direccion') as string || '';

    const donationData: Record<string, any> = {};
    
    if (email) donationData.email = email;
    if (nombre) donationData.nombre = nombre;
    if (apellido) donationData.apellido = apellido;
    if (contrasenia) donationData.contrasenia = contrasenia;
    if (telefono) donationData.telefono = telefono;
    if (direccion) donationData.direccion = direccion;
    
    const token = await getRawToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donaciones/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(donationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Update fallida');
    }

    return { success: true };
  } catch (error) {
    console.error('Update error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar el data donacionees. Por favor intente nuevamente.'
    };
  }
}

// Delete donation
export async function deleteDonation(id: number): Promise<void> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donaciones/${id}`, {
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
    console.error('Error in deleteDonacion:', error);
    throw error;
  }
}
