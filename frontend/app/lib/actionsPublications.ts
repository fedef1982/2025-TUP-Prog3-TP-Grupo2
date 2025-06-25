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

    const titulo = formData.get('titulo')?.toString();
    const descripcion = formData.get('descripcion')?.toString();
    const ubicacion = formData.get('ubicacion')?.toString();
    const contacto = formData.get('contacto')?.toString();
    const estado = formData.get('estado')?.toString();
    const publicado = formData.get('publicado')?.toString();

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

    const publicationData: Record<string, any> = {};
    if (titulo) publicationData.titulo = titulo;
    if (descripcion) publicationData.descripcion = descripcion;
    if (ubicacion) publicationData.ubicacion = ubicacion;
    if (contacto) publicationData.contacto = contacto;
    if (estado) publicationData.estado = estado;
    if (publicado) publicationData.publicado = publicado === 'true';

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
      
      if (response.status === 403) {
        return {
          success: false,
          message: errorData.message || 'Operation not permitted',
          errors: {}
        };
      }

      return {
        success: false,
        message: errorData.message || 'Error updating publication',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Publicación actualizada exitosamente',
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

    const publishedDate = new Date();
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/publicaciones/${publicationId}`,
      {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          publicado: publishedDate.toISOString(),
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
      message: 'Publicación publicada con éxito'
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