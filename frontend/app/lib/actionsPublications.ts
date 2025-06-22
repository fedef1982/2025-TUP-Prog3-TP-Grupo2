'use server';

import { getRawToken, getUserId } from "./server-utils";
import { CreatePublicationDto, CreatePublicationState, UpdatePublicationDto, UpdatePublicationState, PublicationStatus } from './definitionsPublications';

export async function createPublication(
  prevState: CreatePublicationState | null, 
  formData: FormData
): Promise<CreatePublicationState> {
  try {
    const token = await getRawToken(); 
    const userId = await getUserId(); 
    
    if (!token) {
      return { 
        success: false,
        message: 'Authentication required',
        errors: {}
      };
    }

    if (!userId) {
      return {
        success: false,
        message: 'Invalid user ID',
        errors: {}
      };
    }

    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;
    const ubicacion = formData.get('ubicacion') as string;
    const contacto = formData.get('contacto') as string;
    const mascota_id = formData.get('mascota_id') as string;

    const errors: Record<string, string[]> = {};
    if (!titulo) errors.titulo = ['Titulo es requrido'];
    if (!descripcion) errors.descripcion = ['Descripción es requerida'];
    if (!ubicacion) errors.ubicacion = ['Unicación es requerida'];
    if (!contacto) errors.contacto = ['Contacto es requerido'];
    if (!mascota_id) errors.mascota_id = ['Mascota es requrida'];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Missing required fields',
        errors
      };
    }

    const publicationData: CreatePublicationDto = {
      titulo,
      descripcion,
      ubicacion,
      contacto,
      mascota_id: parseInt(mascota_id),
    };

    console.log('#########################');
    console.log('POST ',`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones`);
    console.log('Create publication: ', JSON.stringify(publicationData));
    console.log('#########################');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(publicationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error creating publication',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    console.log('#########################');
    console.log('respuesta: ', data);
    console.log('#########################');

    return { 
      success: true,
      message: 'Publicacion createda exitosamente'
    };

  } catch (error) {
    console.error('Error in createPublication:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error processing request',
      errors: {}
    };
  }
}

export async function updatePublication(
  id: number,
  userId: number,
  prevState: UpdatePublicationState | null,
  formData: FormData
): Promise<UpdatePublicationState> {
  try {
    const token = await getRawToken();
    
    if (!token) {
      return { 
        success: false,
        message: 'Authentication required',
        errors: {}
      };
    }

    if (!userId) {
      return {
        success: false,
        message: 'Invalid user ID',
        errors: {}
      };
    }

    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;
    const ubicacion = formData.get('ubicacion') as string;
    const contacto = formData.get('contacto') as string;
    const estado = formData.get('estado') as string;

    const errors: Record<string, string[]> = {};
    if (titulo && !titulo.trim()) errors.titulo = ['Title cannot be empty'];
    if (descripcion && !descripcion.trim()) errors.descripcion = ['Description cannot be empty'];
    if (ubicacion && !ubicacion.trim()) errors.ubicacion = ['Location cannot be empty'];
    if (contacto && !contacto.trim()) errors.contacto = ['Contact cannot be empty'];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Validation errors',
        errors
      };
    }

    const publicationData: UpdatePublicationDto = {
      ...(titulo && { titulo }),
      ...(descripcion && { descripcion }),
      ...(ubicacion && { ubicacion }),
      ...(contacto && { contacto }),
      ...(estado && { estado: estado as PublicationStatus }),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones/${id}`, {
      method: 'PATCH', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(publicationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error updating publication',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Publication updated successfully'
    };

  } catch (error) {
    console.error('Error in updatePublication:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error processing request',
      errors: {}
    };
  }
}

export async function deletePublication(id: number): Promise<void> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones/${id}`, {
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
        `Error deleting publication with status ${response.status}`
      );
    }

  } catch (error) {
    console.error('Error deleting publication:', error);
    throw error;
  }
}

export async function publishPublication(
  publicationId: number,
  userId: number
): Promise<UpdatePublicationState> {
  try {
    const token = await getRawToken();
    
    if (!token) {
      return { 
        success: false,
        message: 'Authentication required',
        errors: {}
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones/${publicationId}`,
      {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          publicado: new Date().toISOString(),
          estado: PublicationStatus.Abierta
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error publishing publication',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Publication published successfully'
    };

  } catch (error) {
    console.error('Error in publishPublication:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error processing request',
      errors: {}
    };
  }
}