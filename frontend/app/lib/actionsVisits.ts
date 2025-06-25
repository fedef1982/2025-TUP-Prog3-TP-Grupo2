'use server';

import { getRawToken, getUserId } from "./server-utils";
import { 
  CreateVisitaDto, 
  CreateVisitaState, 
  UpdateVisitaState, 
  VisitaEstado 
} from './definitionsVisits';

export async function createVisit(
  prevState: CreateVisitaState | null, 
  formData: FormData,
  publicationId: number
): Promise<CreateVisitaState> {
  try {
    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const telefono = formData.get('telefono') as string;
    const email = formData.get('email') as string;
    const disponibilidad_fecha = formData.get('disponibilidad_fecha') as string;
    const disponibilidad_horario = formData.get('disponibilidad_horario') as string;
    const descripcion = formData.get('descripcion') as string;

    const errors: Record<string, string[]> = {};
    if (!nombre) errors.nombre = ['Nombre es requerido'];
    if (!apellido) errors.apellido = ['Apellido es requerido'];
    if (!telefono) errors.telefono = ['Teléfono es requerido'];
    if (!email) errors.email = ['Email es requerido'];
    if (!disponibilidad_fecha) errors.disponibilidad_fecha = ['Fecha de disponibilidad es requerida'];
    if (!disponibilidad_horario) errors.disponibilidad_horario = ['Horario de disponibilidad es requerido'];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Faltan campos requeridos',
        errors
      };
    }

    const visitData: CreateVisitaDto = {
      nombre,
      apellido,
      telefono,
      email,
      disponibilidad_fecha: new Date(disponibilidad_fecha),
      disponibilidad_horario: disponibilidad_horario as any,
      descripcion: descripcion || undefined,
      publicacion_id: 0
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/publicaciones/${publicationId}/visitas`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error creando la visita',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Visita creada exitosamente',
      trackingId: data.tracking // Retornamos el ID de seguimiento
    };

  } catch (error) {
    console.error('Error in createVisit:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud',
      errors: {}
    };
  }
}

export async function updateVisit(
  id: number,
  userId: number,
  prevState: UpdateVisitaState | null,
  formData: FormData
): Promise<UpdateVisitaState> {
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

    const nombre = formData.get('nombre')?.toString();
    const apellido = formData.get('apellido')?.toString();
    const telefono = formData.get('telefono')?.toString();
    const email = formData.get('email')?.toString();
    const disponibilidad_fecha = formData.get('disponibilidad_fecha')?.toString();
    const disponibilidad_horario = formData.get('disponibilidad_horario')?.toString();
    const estado = formData.get('estado')?.toString();
    const descripcion = formData.get('descripcion')?.toString();

    const errors: Record<string, string[]> = {};
    if (nombre && !nombre.trim()) errors.nombre = ['Nombre no puede estar vacío'];
    if (apellido && !apellido.trim()) errors.apellido = ['Apellido no puede estar vacío'];
    if (telefono && !telefono.trim()) errors.telefono = ['Teléfono no puede estar vacío'];
    if (email && !email.trim()) errors.email = ['Email no puede estar vacío'];
    if (estado && !Object.values(VisitaEstado).includes(estado as VisitaEstado)) {
      errors.estado = ['Estado de visita inválido'];
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Errores de validación',
        errors
      };
    }

    const visitData: Record<string, any> = {};
    if (nombre) visitData.nombre = nombre;
    if (apellido) visitData.apellido = apellido;
    if (telefono) visitData.telefono = telefono;
    if (email) visitData.email = email;
    if (disponibilidad_fecha) visitData.disponibilidad_fecha = new Date(disponibilidad_fecha);
    if (disponibilidad_horario) visitData.disponibilidad_horario = disponibilidad_horario;
    if (estado) visitData.estado = estado;
    if (descripcion) visitData.descripcion = descripcion;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/visitas/${id}`,
      {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(visitData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 403) {
        return {
          success: false,
          message: errorData.message || 'Operación no permitida',
          errors: {}
        };
      }

      return {
        success: false,
        message: errorData.message || 'Error actualizando la visita',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Visita actualizada exitosamente',
    };

  } catch (error) {
    console.error('Error in updateVisit:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud',
      errors: {}
    };
  }
}

export async function deleteVisit(id: number): Promise<void> {
  try {
    const token = await getRawToken();
    const userId = await getUserId();
    
    if (!token || !userId) {
      throw new Error('Autenticación requerida');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/visitas/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error eliminando la visita con estado ${response.status}`
      );
    }

  } catch (error) {
    console.error('Error deleting visit:', error);
    throw error;
  }
}

export async function approveVisit(
  visitId: number,
  userId: number
): Promise<UpdateVisitaState> {
  try {
    const token = await getRawToken();
    
    if (!token) {
      return { 
        success: false,
        message: 'Autenticación requerida',
        errors: {}
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/visitas/${visitId}`,
      {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estado: VisitaEstado.Aprobado
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error aprobando la visita',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Visita aprobada con éxito'
    };

  } catch (error) {
    console.error('Error in approveVisit:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud',
      errors: {}
    };
  }
}

export async function rejectVisit(
  visitId: number,
  userId: number
): Promise<UpdateVisitaState> {
  try {
    const token = await getRawToken();
    
    if (!token) {
      return { 
        success: false,
        message: 'Autenticación requerida',
        errors: {}
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/visitas/${visitId}`,
      {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estado: VisitaEstado.Rechazado
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error rechazando la visita',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Visita rechazada con éxito'
    };

  } catch (error) {
    console.error('Error in rejectVisit:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud',
      errors: {}
    };
  }
}