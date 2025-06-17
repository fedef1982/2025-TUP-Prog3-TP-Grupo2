import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getRawToken, getToken } from './app/lib/server-utils';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  console.log('Entro a MIDDLEWARE');

  const { pathname } = request.nextUrl;

  const cleanPath = pathname.replace(/\/$/, '');

  const publicPaths = ['/', '/login', '/register', '/publicados', '/about', '/contact'];
  
  const privatePaths = ['/dashboard', '/private', '/profile'];

  if (
    publicPaths.includes(cleanPath) || 
    cleanPath.startsWith('/_next') || 
    cleanPath.startsWith('/favicon') ||
    cleanPath.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  const isPrivate = privatePaths.some(path => cleanPath.startsWith(path));
  if (isPrivate && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPrivate && token) {
    try {
      const decoded = jwt.decode(token) as { sub: number; username: string; rol_id: number } | null;

      if (!decoded) {
        throw new Error('Token inválido o malformado');
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', Number(decoded.sub).toString());
      requestHeaders.set('x-user-username', decoded.username);
      requestHeaders.set('x-user-rol-id', decoded.rol_id.toString());

      console.log('######################################################');
      console.log('Entro a pivado y token ok',decoded);
      console.log('id', requestHeaders);
      console.log('######################################################');

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      console.error('Error decodificando el token:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }
  console.log('Entro de MIDDLEWARE a NEXT');
  return NextResponse.next();
}