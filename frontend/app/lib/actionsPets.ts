'use server';

import { getRawToken, getToken, getUserId } from "./server-utils";
import { CreatePetDto, CreatePetState, UpdatePetDto, UpdatePetState, PetStatus, Size, Gender } from './definitionsPets';

export async function createPet(
  prevState: CreatePetState | null, 
  formData: FormData
): Promise<CreatePetState> {
  try {
    const token = await getRawToken(); 
    const userId = await getUserId(); 
    
    if (!token ) {
      return { 
        success: false,
        message: 'Autenticación requerida',
        errors: {}
      };
    }

    if (!userId) {
      return {
        success: false,
        message: 'ID de usuario inválido',
        errors: {}
      };
    }

    const nombre = formData.get('nombre') as string;
    const sexo = formData.get('sexo') as string;
    const tamanio = formData.get('tamanio') as string;
    const fotos_url = formData.get('fotos_url');

    const errors: Record<string, string[]> = {};
    if (!nombre) errors.nombre = ['El nombre es requerido'];
    if (!sexo) errors.sexo = ['El sexo es requerido'];
    if (!tamanio) errors.tamanio = ['El tamaño es requerido'];
    if (!fotos_url) errors.fotos_url = ['Las fotos son requeridas'];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Faltan campos requeridos',
        errors
      };
    }

    const petData = {
      nombre,
      raza: formData.get('raza') as string || undefined,
      sexo,
      edad: formData.get('edad') ? parseInt(formData.get('edad') as string) : undefined,
      vacunado: formData.get('vacunado') === 'on',
      tamanio,
      fotos_url: JSON.parse(fotos_url as string) as string[],
      especie_id: parseInt(formData.get('especie_id') as string),
      condicion_id: parseInt(formData.get('condicion_id') as string),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error al crear la mascota',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Mascota creada exitosamente'
    };

  } catch (error) {
    console.error('Error en createPet:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud',
      errors: {}
    };
  }
}

export async function updatePet(
  id: number,
  userId: number,
  prevState: UpdatePetState | null,
  formData: FormData
): Promise<UpdatePetState> {
  try {
    const token = await getRawToken();
    
    if (!token) {
      return { 
        success: false,
        message: 'Autenticación requerida',
        errors: {}
      };
    }

    if (!userId) {
      return {
        success: false,
        message: 'ID de usuario inválido',
        errors: {}
      };
    }

    const nombre = formData.get('nombre') as string;
    const sexo = formData.get('sexo') as string;
    const tamanio = formData.get('tamanio') as string;
    const fotos_url = formData.get('fotos_url');

    const errors: Record<string, string[]> = {};
    if (!nombre) errors.nombre = ['El nombre es requerido'];
    if (!sexo) errors.sexo = ['El sexo es requerido'];
    if (!tamanio) errors.tamanio = ['El tamaño es requerido'];
    if (!fotos_url) errors.fotos_url = ['Las fotos son requeridas'];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Faltan campos requeridos',
        errors
      };
    }

    const petData = {
      nombre,
      raza: formData.get('raza') as string || undefined,
      sexo,
      edad: formData.get('edad') ? parseInt(formData.get('edad') as string) : undefined,
      vacunado: formData.get('vacunado') === 'on',
      tamanio,
      fotos_url: JSON.parse(fotos_url as string) as string[],
      especie_id: parseInt(formData.get('especie_id') as string),
      condicion_id: parseInt(formData.get('condicion_id') as string),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas/${id}`, {
      method: 'PATCH', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error al actualizar la mascota',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Mascota actualizada exitosamente'
    };

  } catch (error) {
    console.error('Error en updatePet:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud',
      errors: {}
    };
  }
}
   
export async function deletePet(id: number): Promise<void> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/mascotas/${id}`, {
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
