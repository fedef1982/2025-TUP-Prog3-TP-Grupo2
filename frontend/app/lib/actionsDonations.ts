'use server';

import { getRawToken, getToken, getUserId } from "./server-utils";
import { CreateDonationDto, CreateDonationState, UpdateDonationDto, UpdateDonationState } from './definitionsDonations';

export async function createDonation(
  prevState: CreateDonationState | null, 
  formData: FormData
): Promise<CreateDonationState> {
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

    const destinatario = formData.get('destinatario') as string;
    const entidad_financiera = formData.get('entidad_financiera') as string;
    const alias = formData.get('alias') as string;

    const errors: Record<string, string[]> = {};
    if (!destinatario) errors.destinatario = ['El nombre del destinatario es requerido'];
    if (!entidad_financiera) errors.entidad_financiera = ['La entidad financiera es requerida'];
    if (!alias) errors.alias = ['El alias es requerido'];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Faltan campos requeridos',
        errors
      };
    }

    const donationData = {
      destinatario,
      cbu: formData.get('cbu') as string || undefined,
      cuit: formData.get('cuit') as string || undefined,
      entidad_financiera,
      tipo_cuenta: formData.get('tipo_cuenta') as string || undefined,
      alias,
      link_pago: formData.get('link_pago') as string || undefined,
      motivo_donacion: formData.get('motivo_donacion') as string || undefined
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/donaciones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(donationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error al crear datos de donacion',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Datos de donacion creada exitosamente'
    };

  } catch (error) {
    console.error('Error en createDonation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud',
      errors: {}
    };
  }
}

export async function updateDonation(
  id: number,
  userId: number,
  prevState: UpdateDonationState | null,
  formData: FormData
): Promise<UpdateDonationState> {
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

    const destinatario = formData.get('destinatario') as string;
    const entidad_financiera = formData.get('entidad_financiera') as string;
    const alias = formData.get('alias') as string;

    const errors: Record<string, string[]> = {};
    if (!destinatario) errors.destinatario = ['El nombre del destinatario es requerido'];
    if (!entidad_financiera) errors.entidad_financiera = ['La entidad financiera es requerida'];
    if (!alias) errors.alias = ['El alias es requerido'];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Faltan campos requeridos',
        errors
      };
    }

    const donationData = {
      destinatario,
      cbu: formData.get('cbu') as string || undefined,
      cuit: formData.get('cuit') as string || undefined,
      entidad_financiera,
      tipo_cuenta: formData.get('tipo_cuenta') as string || undefined,
      alias,
      link_pago: formData.get('link_pago') as string || undefined,
      motivo_donacion: formData.get('motivo_donacion') as string || undefined,
    };

    console.log("POST Update Doantion", `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/donaciones/${id}`);
    console.log(donationData);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/donaciones/${id}`, {
      method: 'PATCH', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(donationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Error al actualizar datos de donacion',
        errors: errorData.errors || {}
      };
    }

    const data = await response.json();

    return { 
      success: true,
      message: 'Datos de donacion actualizados exitosamente'
    };

  } catch (error) {
    console.error('Error en updateDonation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud',
      errors: {}
    };
  }
}

export async function deleteDonation(id: number): Promise<{ ok: true } | { ok: false; message: string }> {
  const token = await getRawToken();
  const userId = await getUserId();

  if (!token || !userId) {
    return { ok: false, message: 'Authentication required' };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/donaciones/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.ok) {
    return { ok: true };
  }

  const errorData = await response.json().catch(() => ({}));

  return {
    ok: false,
    message:
      errorData.message ??
      `No se pudo eliminar la mascota (estado ${response.status})`,
  };
}