'use server';

import { getRawToken, getToken } from "./server-utils";
import { CreatePetDto, CreatePetState, UpdatePetDto, UpdatePetState, PetStatus, Size, Gender } from './definitionsPets';

export async function createPet(
  prevState: CreatePetState | undefined,
  formData: FormData
) {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const tokenPl = await getToken();
    const userId = tokenPl?.sub;

    // Obtener datos del formulario
    const nombre = formData.get('nombre') as string;
    const raza = formData.get('raza') as string || undefined;
    const sexo = formData.get('sexo') as Gender;
    const edad = formData.get('edad') ? parseInt(formData.get('edad') as string) : undefined;
    const vacunado = formData.get('vacunado') === 'on';
    const tamanio = formData.get('tamanio') as Size;
    const fotos_url = JSON.parse(formData.get('fotos_url') as string) as string[];
    const especie_id = parseInt(formData.get('especie_id') as string);
    const condicion_id = parseInt(formData.get('condicion_id') as string);

    const petData: CreatePetDto = {
      nombre,
      raza,
      sexo,
      edad,
      vacunado,
      tamanio,
      fotos_url,
      especie_id,
      condicion_id,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(petData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || 'Error al crear la mascota',
        errors: data.errors,
        success: false
      };
    }

    return {
      message: 'Mascota creada exitosamente',
      success: true
    };
  } catch (error) {
    console.error('Error al crear mascota:', error);
    return { 
      success: false,
      message: error instanceof Error ? error.message : 'Error al crear la mascota. Por favor intente nuevamente.'
    };
  }
}

export async function updatePet(
  id: number, 
  userId: number, 
  prevState: UpdatePetState | undefined, 
  formData: FormData
) {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    // Transformar los valores del formulario al formato esperado por el backend
    const petData: Record<string, any> = {
      nombre: formData.get('nombre') as string,
      raza: formData.get('raza') as string || undefined,
      sexo: formData.get('sexo') === 'MACHO' ? 'Macho' : 'Hembra',
      edad: formData.get('edad') ? parseInt(formData.get('edad') as string) : undefined,
      vacunado: formData.get('vacunado') === 'on',
      tamanio: formData.get('tamanio') === 'CHICO' ? 'Chico' : 
              formData.get('tamanio') === 'MEDIANO' ? 'Mediano' : 'Grande',
      fotos_url: JSON.parse(formData.get('fotos_url') as string) as string[],
      especie_id: parseInt(formData.get('especie_id') as string),
      condicion_id: parseInt(formData.get('condicion_id') as string),
      descripcion: formData.get('descripcion') as string || undefined,
      status: formData.get('status') as PetStatus || undefined
    };

    // Validación básica de campos requeridos
    if (!petData.nombre) {
      throw new Error('El nombre es requerido');
    }
    if (!petData.fotos_url || petData.fotos_url.length === 0) {
      throw new Error('Debe proporcionar al menos una foto');
    }
    if (petData.fotos_url.length > 4) {
      throw new Error('Máximo 4 fotos permitidas');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(petData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error en la respuesta del servidor:', data);
      return {
        message: data.message || 'Error al actualizar la mascota',
        errors: data.errors || {},
        success: false
      };
    }

    return {
      message: 'Mascota actualizada exitosamente',
      success: true,
      pet: data // Incluir los datos actualizados de la mascota
    };
  } catch (error) {
    console.error('Error al actualizar mascota:', error);
    return { 
      success: false,
      message: error instanceof Error ? error.message : 'Error al actualizar la mascota. Por favor intente nuevamente.',
      errors: {}
    };
  }
}
   

export async function deletePet(id: number): Promise<void> {
  try {
    const token = await getRawToken();
    if (!token) {
      throw new Error('No se ha encontrado ningún token de autenticación');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/${id}`, {
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
        `Error al eliminar la mascota con estado ${response.status}`
      );
    }

  } catch (error) {
    console.error('Error al eliminar mascota:', error);
    throw error;
  }
}