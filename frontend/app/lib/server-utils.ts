'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: number;
  username: string;
  rol_id: number;
  iat?: number;  
  exp?: number;  
}

// Función síncrona para obtener el token
export async function getRawToken(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    return (await cookieStore).get('token')?.value || null;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
}

// Función síncrona para verificar el token
export async function getToken(): Promise<JwtPayload | null> {
  try {
    const token = await getRawToken();
    
    // Verificaciones iniciales
    if (!token || !process.env.JWT_SECRET) {
      return null;
    }

    // Verificación segura del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificación de tipo con guardia de tipos
    if (typeof decoded === 'string' || !isJwtPayload(decoded)) {
      throw new Error('Estructura de token inválida');
    }

    return decoded;
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return null;
  }
}

// Guardia de tipos para JwtPayload
function isJwtPayload(data: unknown): data is JwtPayload {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const payload = data as Record<string, unknown>;
  return (
    typeof payload.sub === 'number' &&
    typeof payload.username === 'string' &&
    typeof payload.rol_id === 'number'
  );
}

// Función síncrona para obtener el ID de usuario
export async function getUserId(): Promise<number | null> {
  const payload = await getToken();
  return payload?.sub || null;
}